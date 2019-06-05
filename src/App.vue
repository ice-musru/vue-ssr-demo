<template>
  <div id="app">
    <h1>竟然好了!!!!</h1>
    <div class="text">123456</div>
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
h1{
  color:red;
  font-size: 58px;
}
.text{
  color: green;
  font-size: 36px;
  font-weight: bold;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
