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
    
    <div class="history-container">
      <h2 class="history-title">Historial</h2>
      <div class="history-box">
        <p class="history-date">{{ currentDate }}</p>
        <ul class="history-list">
          <li v-for="(transaction, index) in transactions" :key="index" class="history-item">
            <span class="transaction-description">{{ transaction.description }}</span>
            <span class="transaction-amount">${{ transaction.amount }}</span>
          </li>
          
        </ul>
        
      </div>
      
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

export default {
  name: 'Historial',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const auth = getAuth()
    const playerName = ref('')
    const playerBalance = ref(1500)
    const transactions = ref([])
    const gameCode = route.params.gameCode
    const currentDate = new Date().toLocaleDateString('es-ES')

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
          transactions.value = gameData.transactions || []
        } else {
          console.error('Jugador no encontrado en la partida')
          router.push('/game-room')
        }
      } catch (error) {
        console.error('Error al cargar los datos del jugador:', error)
        router.push('/game-room')
      }
    })

    return {
      playerName,
      playerBalance,
      transactions,
      currentDate
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


.history-container {
  text-align: center;
  color: white;
  margin-top: 20px;
}

.history-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 2px 2px 0 black;
}

.history-box {
  background-color: #2d7c1f;
  padding: 10px;
  border-radius: 10px;
  max-width: 90%;
  margin: 0 auto;
}

.history-date {
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 1px 1px 0 black;
  margin-bottom: 5px;
}

.history-list {
  list-style: none;
  padding: 0;
}

.history-item {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  color: white;
  border-bottom: 1px solid white;
  padding: 5px 0;
}

.transaction-description {
  font-weight: bold;
}

.transaction-amount {
  font-weight: bold;
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
