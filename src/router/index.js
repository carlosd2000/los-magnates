import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import GameRoom from '../components/GameRoom.vue'
import GameLobby from '../components/GameLobby.vue'
import JoinGame from '../components/JoinGame.vue'
import GameView from '../components/GameView.vue'
import TransactionView from '../components/TransactionView.vue'
import Historial from '../components/Historial.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/game-room',
    name: 'GameRoom',
    component: GameRoom
  },
  {
    path: '/game-lobby/join',
    name: 'JoinGame',
    component: JoinGame
  },
  {
    path: '/game-lobby/create',
    name: 'CreateGame',
    component: GameLobby
  },
  {
    path: '/game-lobby/:gameCode',
    name: 'GameLobby',
    component: GameLobby,
    props: true
  },
  {
    path: '/game/:gameCode',
    name: 'GameView',
    component: GameView,
    props: true
  },
  {
    path: '/game/:gameCode/transactions',
    name: 'TransactionView',
    component: TransactionView,
    props: true
  },
  {
    path: '/game/:gameCode/historial',
    name: 'Historial',
    component: Historial,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 