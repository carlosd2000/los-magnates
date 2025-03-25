<template>
  <div class="game-container py-4">
    <!-- Logo Monopoly -->
    <div class="text-center mb-4">
      <img src="../assets/monopoly-logo.png" alt="Monopoly Logo" class="img-fluid" style="max-width: 300px;">
    </div>

    <!-- Código de partida -->
    <div class="mb-4 d-flex align-items-center">
      <h2 class="text-white mb-0 me-2">Partida:</h2>
      <div class="bg-white rounded p-2 d-flex align-items-center">
        <span class="h3 mb-0 me-2" style="font-family: 'Press Start 2P', cursive;">{{ gameCode }}</span>
        <button @click="copyGameCode" class="btn btn-outline-primary">
          <i class="bi bi-clipboard"></i>
        </button>
      </div>
    </div>

    <!-- Lista de jugadores -->
    <div class="w-100 max-width-500 px-3">
      <div v-for="(player, index) in sortedPlayers" :key="player.uid" 
           class="d-flex align-items-center mb-3">
        <div class="player-avatar rounded-circle p-3 me-3">
          <i class="bi bi-person-fill text-dark fs-4"></i>
        </div>
        <span class="text-white h4 mb-0">{{ player.name }}</span>
      </div>
    </div>

    <!-- Botón Iniciar partida -->
    <button 
      v-if="isHost"
      @click="startGame" 
      :disabled="loading || players.length < 2"
      class="btn btn-success btn-lg mt-4 px-5 py-3 rounded-pill">
      Iniciar partida
    </button>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { gameService } from '../firebase/gameService'
import { getAuth } from 'firebase/auth'

export default {
  name: 'GameLobby',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const auth = getAuth()
    const gameCode = ref('')
    const players = ref([])
    const loading = ref(false)
    const error = ref('')
    let unsubscribe = null

    // Ordenar jugadores: host primero, luego el resto por orden de unión
    const sortedPlayers = computed(() => {
      return [...players.value].sort((a, b) => {
        if (a.isHost) return -1
        if (b.isHost) return 1
        return a.joinedAt - b.joinedAt
      })
    })

    const isHost = computed(() => {
      const currentPlayer = players.value.find(p => p.id_user === auth.currentUser?.uid)
      return currentPlayer?.isHost || false
    })

    const createGame = async () => {
      try {
        loading.value = true
        error.value = ''
        const code = await gameService.createGame(auth.currentUser.uid)
        gameCode.value = code
        router.replace(`/game-lobby/${code}`)
        subscribeToGame(code)
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const joinExistingGame = async (code) => {
      try {
        loading.value = true
        error.value = ''
        await gameService.joinGame(code, auth.currentUser.uid)
        gameCode.value = code
        subscribeToGame(code)
      } catch (err) {
        error.value = err.message
        router.push('/game-lobby/join')
      } finally {
        loading.value = false
      }
    }

    const subscribeToGame = (code) => {
      if (unsubscribe) {
        unsubscribe()
      }
      
      unsubscribe = gameService.subscribeToGame(code, (gameData) => {
        if (!gameData) {
          error.value = 'La sala ya no existe'
          router.push('/game-lobby/join')
          return
        }
        players.value = gameData.players
        if (gameData.status === 'playing') {
          router.push(`/game-room/${code}`)
        }
      })
    }

    const copyGameCode = async () => {
      try {
        await navigator.clipboard.writeText(gameCode.value)
        console.log('Código copiado al portapapeles')
      } catch (err) {
        error.value = 'Error al copiar el código'
      }
    }

    const startGame = async () => {
      if (players.value.length >= 2) {
        try {
          await gameService.startGame(gameCode.value)
          router.push(`/game/${gameCode.value}`)
        } catch (error) {
          console.error('Error al iniciar el juego:', error)
        }
      }
    }

    onMounted(async () => {
      if (!auth.currentUser) {
        router.push('/login')
        return
      }

      const currentCode = route.params.gameCode
      
      if (route.path === '/game-lobby/create') {
        await createGame()
      } else if (currentCode) {
        await joinExistingGame(currentCode)
      }
    })

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })

    return {
      gameCode,
      players,
      sortedPlayers,
      loading,
      error,
      isHost,
      copyGameCode,
      startGame
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.max-width-500 {
  max-width: 500px;
}

.player-avatar {
  background-color: var(--warning-color);
}

.btn-success {
  font-size: 1.25rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: var(--success-color) !important;
  border-color: var(--success-color) !important;
}

.btn-success:disabled {
  background-color: #808080 !important;
  border-color: #808080 !important;
}
</style> 