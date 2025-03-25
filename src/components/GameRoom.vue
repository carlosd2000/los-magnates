<template>
  <div class="game-container min-vh-100 d-flex flex-column justify-content-center align-items-center p-4" style="background-color: #87CEEB;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6 text-center">
          <div class="mb-5">
            <img src="../assets/monopoly-logo.png" alt="Monopoly Logo" class="img-fluid monopoly-logo" />
          </div>
          
          <div class="d-grid gap-3">
            <button class="btn btn-custom btn-lg fw-bold" @click="createRoom">
              Crear Sala
            </button>

            <button class="btn btn-custom btn-lg fw-bold" @click="joinRoom">
              Unir a sala
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'

export default {
  name: 'GameRoom',
  setup() {
    const router = useRouter()
    const auth = getAuth()

    const createRoom = () => {
      if (!auth.currentUser) {
        router.push('/login')
        return
      }
      router.push('/game-lobby/create')
    }

    const joinRoom = () => {
      if (!auth.currentUser) {
        router.push('/login')
        return
      }
      router.push('/game-lobby/join')
    }

    return {
      createRoom,
      joinRoom
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

.btn-custom {
  background-color: #198754;
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.btn-custom:hover,
.btn-custom:focus,
.btn-custom:active {
  background-color: #FFD700 !important;
  color: #000 !important;
  transform: scale(0.98);
}

.btn:active {
  transform: scale(0.98);
}
</style> 