$(document).ready(function() {
  // Handle form submission for Sign Up
  $('#signup-form').submit(function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    var formData = {
      firstName: $('#firstName').val(),
      lastName: $('#lastName').val(),
      email: $('#signup-email').val(),
      password: $('#signup-password').val()
    };

    // Send AJAX POST request to sign up endpoint
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/api/v1/auth/register',
      data: JSON.stringify(formData), // Convert formData to JSON string
      contentType: 'application/json', // Set content type to JSON
      success: function(response) {
        console.log('Sign up successful:', response);
        console.log('Trying to show modal...');
        $('#success-modal').show(); // Show the custom popup
      },    
      error: function(xhr, status, error) {
        console.error('Sign up failed:', xhr.responseText);
        // Handle sign up failure, show error message, etc.
        var errorMessage = JSON.parse(xhr.responseText).error;
        // Show error message to the user on screen
        $('#signup-error').text('Sign up failed: ' + errorMessage).show();
      }
    });
  });

  // Handle form submission for Log In
  $('#login-form').submit(function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Capture form data
    var formData = {
      email: $('#login-email').val(),
      password: $('#login-password').val()
    };

    // Send AJAX request to login endpoint
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/api/v1/auth/login',
      data: JSON.stringify(formData), // Convert formData to JSON string
      contentType: 'application/json', // Set content type to JSON
      success: function(response) {
        // Handle successful response
        console.log(response);
        if (response.success) {
          // If login successful, fetch user data
          fetchUserData(response.accessToken);
        } else {
          // Show error message if login failed
          alert('Login failed. Please check your credentials.');
        }
      },
      error: function(xhr, status, error) {
        // Handle error response
        console.error(xhr.responseText);
        alert('An error occurred during login. Please try again later.');
      }
    });
  });
});


function fetchUserData(accessToken) {
  // Send AJAX request to fetch user data using the access token
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/api/v1/auth/me',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: function(response) {
      // Populate user information in the modal content
      var userInfoHTML = '<p>First Name: ' + response.data.firstName + '</p>' +
                        '<p>Last Name: ' + response.data.lastName + '</p>' +
                        '<p>Email: ' + response.data.email + '</p>';
      $('#user-info-content').html(userInfoHTML);

      // Show the user info modal
      $('#user-info-modal').show();
    },
    error: function(xhr, status, error) {
      // Handle error response
      console.error(xhr.responseText);
      alert('An error occurred while fetching user data. Please try again later.');
    }
  });
}


function closeUserInfoModal() {
  $('#user-info-modal').hide();
}

// Bind a click event handler to the "Close" button inside the modal
$('#user-info-modal button').click(function(event) {
  // Prevent the default behavior of the button (e.g., form submission)
  event.preventDefault();

  // Hide the modal
  $('#user-info-modal').hide();
});





function showLogin() {
  $('#signup').hide();
  $('#login').show();
  $('#success-modal').hide();
}










// Existing code for handling form input highlighting and tab navigation remains unchanged
$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
    var $this = $(this),
        label = $this.prev('label');
  
        if (e.type === 'keyup') {
              if ($this.val() === '') {
            label.removeClass('active highlight');
          } else {
            label.addClass('active highlight');
          }
      } else if (e.type === 'blur') {
          if( $this.val() === '' ) {
              label.removeClass('active highlight'); 
              } else {
              label.removeClass('highlight');   
              }   
      } else if (e.type === 'focus') {
        
        if( $this.val() === '' ) {
              label.removeClass('highlight'); 
              } 
        else if( $this.val() !== '' ) {
              label.addClass('highlight');
              }
      }
  
  });
  
  $('.tab a').on('click', function (e) {
    
    e.preventDefault();
    
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
    
    target = $(this).attr('href');
  
    $('.tab-content > div').not(target).hide();
    
    $(target).fadeIn(600);
    
  });

  