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

    <div class="transaction-form">
      <h3 class="form-label">Historial:</h3>
      <div class="amount-input">
        <span class="currency-symbol">$</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
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
    const amount = ref('')
    const selectedDestination = ref('')
    const otherPlayers = ref([])
    const gameCode = route.params.gameCode

    const isValidTransaction = computed(() => {
      return amount.value > 0 && 
             amount.value <= playerBalance.value && 
             selectedDestination.value
    })

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
          // Filtrar jugadores para no incluir al jugador actual
          otherPlayers.value = gameData.players.filter(p => p.id_user !== auth.currentUser.uid)
        } else {
          console.error('Jugador no encontrado en la partida')
          router.push('/game-room')
        }
      } catch (error) {
        console.error('Error al cargar los datos del jugador:', error)
        router.push('/game-room')
      }
    })

    const selectDestination = (destination) => {
      selectedDestination.value = destination
    }

    const sendMoney = async () => {
      if (!isValidTransaction.value) return

      try {
        await gameService.makeTransaction(gameCode, {
          from: auth.currentUser.uid,
          to: selectedDestination.value,
          amount: Number(amount.value)
        })
        router.push(`/game/${gameCode}`)
      } catch (error) {
        console.error('Error al realizar la transacción:', error)
      }
    }

    return {
      playerName,
      playerBalance,
      amount,
      selectedDestination,
      otherPlayers,
      isValidTransaction,
      selectDestination,
      sendMoney
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

.transaction-form {
  width: 80%;
  max-width: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-label {
  color: #000;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 1px 1px 0 #fff;
}

.amount-input {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
}

.amount-input input {
  padding-left: 2rem;
  height: 3rem;
  font-size: 1.2rem;
  border-radius: 25px;
  border: 2px solid var(--warning-color);
}

.destination-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dropdown-toggle {
  border-radius: 25px;
  height: 3rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.dropdown-menu {
  border-radius: 15px;
  padding: 0.5rem;
}

.dropdown-item {
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-weight: bold;
}

.dropdown-item:hover {
  background-color: var(--warning-color);
}

.send-money-btn {
  padding: 1rem;
  border-radius: 25px;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 1rem;
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