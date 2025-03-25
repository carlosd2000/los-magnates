<template>
  <div class="game-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6 text-center">
          <div class="mb-4">
            <img src="../assets/monopoly-logo.png" alt="Monopoly Logo" class="img-fluid monopoly-logo" />
          </div>
          
          <div v-if="error" class="alert alert-danger mb-3" role="alert">
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3">
            <div class="form-group">
              <label class="text-label mb-2">Correo</label>
              <input 
                type="email" 
                class="form-control form-control-lg text-center" 
                v-model="formData.correo"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="text-label mb-2">Contraseña</label>
              <input 
                type="password" 
                class="form-control form-control-lg text-center" 
                v-model="formData.contrasena"
                required
              />
            </div>
            
            <button type="submit" class="btn btn-custom btn-lg fw-bold mt-4" :disabled="loading">
              {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
            </button>

            <button type="button" class="btn btn-link text-white" @click="goBack" :disabled="loading">
              Volver
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from '../firebase/auth'

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        correo: '',
        contrasena: ''
      },
      loading: false,
      error: null
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.error = null
      
      const result = await AuthService.login({
        email: this.formData.correo,
        password: this.formData.contrasena
      })

      if (result.success) {
        // Guardamos el perfil del usuario en el localStorage para tener acceso a él
        localStorage.setItem('userProfile', JSON.stringify(result.profile))
        this.$router.push('/game-room')
      } else {
        this.error = result.error
      }

      this.loading = false
    },
    goBack() {
      this.$router.push('/')
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

.text-label {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: -2px -2px 0 #000,  
               2px -2px 0 #000,
               -2px 2px 0 #000,
               2px 2px 0 #000;
}

.form-control {
  border: 2px solid #000;
  background-color: white;
  padding: 0.8rem;
  font-size: 1.1rem;
}

.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(255, 215, 0, 0.25);
  border-color: #000;
}

.btn-custom {
  background-color: #198754;
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.btn-custom:hover:not(:disabled),
.btn-custom:focus:not(:disabled),
.btn-custom:active:not(:disabled) {
  background-color: #FFD700 !important;
  color: #000 !important;
  transform: scale(0.98);
}

.btn-custom:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-link {
  text-decoration: none;
  font-weight: bold;
  text-shadow: -1px -1px 0 #000,  
               1px -1px 0 #000,
               -1px 1px 0 #000,
               1px 1px 0 #000;
}

.btn-link:hover:not(:disabled) {
  color: #FFD700 !important;
}

.alert {
  border: 2px solid #000;
  font-weight: bold;
}
</style> 