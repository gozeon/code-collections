node('master') {

    stage('测试') {

      	def userInput
      	def didTimeout

      	try {
      		timeout(time: 10, unit: 'SECONDS') {
	      	    userInput = input(
	      	        id: 'Proceed1', message: 'Delete node_modules?', parameters: [
	      	        [$class: 'BooleanParameterDefinition', defaultValue: true, description: '', name: 'Please confirm you agree with this']
	      	    ])
      	    }
      	} catch(err) {
      	    def user = err.getCauses()[0].getUser()


      	    if('SYSTEM' == user.toString()) {
      	    	didTimeout = true
      	    } else {
      	    	didTimeout = false
      	    	userInput = false
      	    	echo "Aborted by: [${user}]"
      	    }
      	}

      	node {
      		if(didTimeout) {
      			// do something on timeout
      			 echo "no input was received before timeout"
      		} else if (userInput == true) {
      	        // do something
      	        echo "this was successful"
      	    } else {
      	        // do something else
      	        echo "this was not successful"
      	        currentBuild.result = 'FAILURE'
      	    }
      	}

	}

}
