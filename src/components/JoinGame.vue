<template>
  <div class="game-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6 text-center">
          <div class="mb-5">
            <img src="../assets/monopoly-logo.png" alt="Monopoly Logo" class="img-fluid monopoly-logo" />
          </div>

          <h2 class="text-white mb-4 text-shadow">
            Ingresa el código<br>
            para unirte a una sala
          </h2>

          <div class="mb-4">
            <input 
              type="text" 
              class="form-control text-center game-code-input"
              v-model="gameCode"
              placeholder="123789"
              maxlength="6"
              @input="error = ''"
            />
          </div>

          <div class="d-grid gap-3">
            <button 
              @click="joinGame" 
              class="btn btn-custom btn-lg fw-bold"
              :disabled="loading || !isValidGameCode"
            >
              {{ loading ? 'Uniéndose...' : 'Unirme' }}
            </button>
          </div>

          <div class="error-message mt-3" v-if="error">{{ error }}</div>
        </div>
      </div>
    </div>
    
    <div class="home-button-container">
      <button 
        @click="goHome" 
        class="btn-home"
        title="Volver al inicio"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
          <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { gameService } from '../firebase/gameService'
import { getAuth } from 'firebase/auth'

export default {
  name: 'JoinGame',
  setup() {
    const router = useRouter()
    const auth = getAuth()
    const gameCode = ref('')
    const loading = ref(false)
    const error = ref('')
    const gameCode = route.params.gameCode

    const isValidGameCode = computed(() => {
      return gameCode.value.length === 6
    })

    const joinGame = async () => {
      if (!auth.currentUser) {
        router.push(`/game-lobby/${gameCode}`)
        return
      }

      if (!isValidGameCode.value) {
        error.value = 'El código debe tener 6 caracteres'
        return
      }

      const formattedCode = gameCode.value.toUpperCase()

      try {
        loading.value = true
        error.value = ''
        
        await gameService.joinGame(formattedCode, auth.currentUser.uid)
        
        await router.push({
          name: 'GameLobby',
          params: { gameCode: formattedCode }
        }).catch(err => {
          console.error('Error de navegación:', err)
          error.value = 'Error al cargar la sala'
        })
      } catch (err) {
        console.error('Error al unirse a la sala:', err)
        error.value = err.message || 'Error al unirse a la sala'
      } finally {
        loading.value = false
      }
    }

    const goHome = () => {
      router.push('/')
    }

    return {
      gameCode,
      loading,
      error,
      isValidGameCode,
      joinGame,
      goHome
    }
  }
}
</script>

<style scoped>
.monopoly-logo {
  width: 100%;
  max-width: 250px;
  height: auto;
}

.text-shadow {
  text-shadow: -2px -2px 0 #000,  
               2px -2px 0 #000,
               -2px 2px 0 #000,
               2px 2px 0 #000,
               4px 4px 6px rgba(0, 0, 0, 0.3);
}

.game-code-input {
  font-size: 2rem;
  height: auto;
  padding: 15px;
  background-color: white;
  border: 3px solid #000;
  border-radius: 10px;
  font-weight: bold;
  letter-spacing: 2px;
}

.game-code-input::placeholder {
  color: #ccc;
}

.btn-custom {
  background-color: #198754;
  color: white;
  border: none;
  transition: all 0.3s ease;
  font-size: 1.5rem;
  padding: 15px 30px;
  text-transform: uppercase;
}

.btn-custom:hover,
.btn-custom:focus,
.btn-custom:active {
  background-color: #FFD700 !important;
  color: #000 !important;
  transform: scale(0.98);
}

.btn-custom:disabled {
  background-color: #ccc !important;
  cursor: not-allowed;
}

.home-button-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.btn-home {
  background: none;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-home:hover {
  transform: scale(1.2);
}

.error-message {
  color: #ff4444;
  font-weight: bold;
  text-shadow: 1px 1px 0 #000;
}
</style> 