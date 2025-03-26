<template>
  <div class="game-container">
    <div class="player-info">
      <div class="avatar-container">
        <div class="avatar">
          <i class="bi bi-person-fill"></i>
        </div>
      </div>
      <div class="player-details">
        <h2 class="player-name">{{ playerName }}</h2>
        <div class="balance">
          <span class="balance-label">Saldo</span>
          <span class="balance-amount">${{ playerBalance }}</span>
        </div>
      </div>
    </div>

    <div class="actions-container">
      <button class="btn btn-success action-btn" @click="goToTransactions">
        Transacciones
      </button>
      <button class="btn btn-success action-btn" @click="goToHistorial">
        Historial
      </button>
      <button class="btn btn-success action-btn" @click="confirmLeaveGame">
        Salir de partida
      </button>
    </div>

    <div class="logo-container">
      <img src="../assets/monopoly-logo.png" alt="Monopoly Logo" class="monopoly-logo" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { gameService } from '../firebase/gameService'
import Swal from 'sweetalert2'

export default {
  name: 'GameView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const auth = getAuth()
    const playerName = ref('')
    const playerBalance = ref(1500)
    const gameCode = route.params.gameCode

    onMounted(async () => {
      if (!auth.currentUser) {
        router.push('/login')
        return
      }

      try {
        const gameData = await gameService.getGame(gameCode)
        const currentPlayer = gameData.players.find(p => p.id_user === auth.currentUser.uid)
        
        if (currentPlayer) {
          playerName.value = currentPlayer.name
          playerBalance.value = currentPlayer.saldo
        } else {
          console.error('Jugador no encontrado en la partida')
          router.push('/game-room')
        }
      } catch (error) {
        console.error('Error al cargar los datos del jugador:', error)
        router.push('/game-room')
      }
    })
    
    const leaveGame = async () => {
      try {
        await gameService.leaveGame(gameCode, auth.currentUser.uid)
        router.push('/game-room')
      } catch (error) {
        console.error('Error al salir de la partida:', error)
      }
    }
    

  const confirmLeaveGame = () => {
    Swal.fire({
    title: '¿Seguro que desea salir de la partida?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Salir',
    cancelButtonText: 'Seguir jugando',
    confirmButtonColor: '#d33',  // Rojo
    cancelButtonColor: '#28a745' // Verde
    }).then((result) => {
    if (result.isConfirmed) {
      leaveGame()
    }
    })
  }



    const goToTransactions = () => {
      router.push(`/game/${gameCode}/transactions`)
    }

    const goToHistorial = () => {
      router.push(`/game/${gameCode}/historial`)
    }

    return {
      playerName,
      playerBalance,
      leaveGame,
      goToTransactions,
      goToHistorial,
      confirmLeaveGame
    }
  }
}
</script>

<style scoped>
.player-info {
  width: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.avatar-container {
  background-color: var(--warning-color);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  font-size: 2.5rem;
  color: #000;
}

.player-details {
  text-align: left;
}

.player-name {
  color: #000;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 0 #fff;
}

.balance {
  display: flex;
  flex-direction: column;
}

.balance-label {
  font-size: 1.8rem;
  font-weight: bold;
  color: #000;
  text-shadow: 2px 2px 0 #fff;
}

.balance-amount {
  font-size: 2.5rem;
  font-weight: bold;
  color: #000;
  text-shadow: 2px 2px 0 #fff;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 80%;
  max-width: 300px;
  margin: 0 auto;
}

.action-btn {
  padding: 1rem;
  border: none;
  border-radius: 25px;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.action-btn:active,
.action-btn:focus {
  background-color: var(--warning-color) !important;
  border-color: var(--warning-color) !important;
  color: #000 !important;
  transform: scale(0.98);
}

.action-btn:hover {
  background-color: var(--warning-color) !important;
  border-color: var(--warning-color) !important;
  color: #000 !important;
}

.transactions-btn,
.history-btn,
.leave-btn {
  background-color: var(--success-color);
  color: white;
}

.logo-container {
  position: fixed;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.monopoly-logo {
  width: 200px;
  height: auto;
}
</style> 