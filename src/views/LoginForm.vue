<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-dark text-white" style="border-radius: 1rem">
            <div class="card-body p-5 text-center">
              <div class="mb-md-5 mt-md-4 pb-5">
                <h1 class="fw-bold mb-2 text-uppercase">To Do List</h1>
                <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                <p class="text-white-50 mb-5">Please enter your login and password!</p>
                <form @submit.prevent="login" method="post">
                  <div class="form-outline form-white mb-4">
                    <label class="form-label" for="email">Email</label>
                    <input
                      v-model="email"
                      type="email"
                      id="email"
                      class="form-control form-control-lg"
                    />
                  </div>
                  <div class="form-outline form-white mb-4">
                    <label class="form-label" for="password">Password</label>
                    <input
                      v-model="password"
                      type="password"
                      id="password"
                      class="form-control form-control-lg"
                    />
                  </div>
                  <button class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>
                </form>
              </div>
              <div>
                <p class="mb-0">
                  Don't have an account?
                  <router-link to="/register" class="text-white-50 fw-bold">Sign Up</router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login() {
      const userData = {
        email: this.email,
        password: this.password
      };

      try {
        const response = await axios.post('/login', userData);
        console.log(response.data.message);

        // Redirect to a success page or perform any other action
        this.$router.push('/home');
      } catch (error) {
        console.error(error);

        // Show an error message or perform any other action
        // For simplicity, let's log the error message
        console.log('Login failed');
      }
    }
  }
}
</script>
