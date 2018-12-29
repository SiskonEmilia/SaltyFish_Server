let main = new Vue({
  el: '#main',
  data: {
    testForm: {
      username: '',
      password: '',
      oldPassword: '',
      data: '',
      urlRoot: 'http://' + window.location.host + '/',
      urlRelative: '',
      returnedData: ''
    },
  },
  methods: {
    get: function() {
      let vueInstance = this;
      axios.get('/' + this.testForm.urlRelative)
      .then(response => {
        vueInstance.testForm.returnedData = JSON.stringify({
          statusCode: response.status,
          returnedData: response.data
        } , null, 4)
        vueInstance.$message.success('Request succeeded')
      })
      .catch(error => {
        vueInstance.$message.error('Error')
        if (error.response) {
          vueInstance.testForm.returnedData = JSON.stringify({
            statusCode: error.response.status,
            returnedData: error.response.data
          } , null, 4)
        }
        console.error(error);
      })
    },
    post: function() {
      let vueInstance = this;
      axios.post('/' + this.testForm.urlRelative, {
        username: vueInstance.testForm.username,
        password: vueInstance.testForm.password,
        oldPassword: vueInstance.testForm.oldPassword,
        data: vueInstance.testForm.data,
        time: (new Date()).getTime()
      })
      .then(response => {
        vueInstance.testForm.returnedData = JSON.stringify({
          statusCode: response.status,
          returnedData: response.data
        } , null, 4)
        vueInstance.$message.success('Request succeeded')
      })
      .catch(error => {
        vueInstance.$message.error('Error')
        if (error.response) {
          vueInstance.testForm.returnedData = JSON.stringify({
            statusCode: error.response.status,
            returnedData: error.response.data
          } , null, 4)
        }
        console.error(error);
      })
    },
  },
  mounted() {
    
  },
})