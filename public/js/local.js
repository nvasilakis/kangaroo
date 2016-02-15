$(document).ready(function(){

  // For settings/account
  $('#verif').on('input', function() {
    if ($('#verif').val() == "DELETE") {
      $('#delSubmit').prop("disabled", false); 
      $('#delReply').text("We are still going to miss you; and hope to see you back again soon!")
    }
  });

});
