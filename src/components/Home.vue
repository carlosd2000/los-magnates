<template>
  <div class="game-container min-vh-100 d-flex flex-column justify-content-center align-items-center p-4" style="background-color: #87CEEB;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6 text-center">
          <div class="mb-5">
            <img src="../assets/monopoly-logo.png" alt="Monopoly Logo" class="img-fluid monopoly-logo" />
          </div>
          
          <h1 class="display-4 text-white mb-4 text-shadow">Bienvenidos</h1>
          
          <div class="d-grid gap-3">
            <button class="btn btn-custom btn-lg fw-bold" @click="goToRegister">
              Registrarse
            </button>
            <button class="btn btn-custom btn-lg fw-bold" @click="goToLogin">
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    goToRegister() {
      this.$router.push('/register')
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.text-shadow {
  text-shadow: -2px -2px 0 #000,  
               2px -2px 0 #000,
               -2px 2px 0 #000,
               2px 2px 0 #000,
               4px 4px 6px rgba(0, 0, 0, 0.3);
}

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