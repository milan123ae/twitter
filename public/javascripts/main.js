 $(document).ready(function(){
	$('.deletesubscriber').on('click',deleteSubscriber);
     $('.insertComment').on('click', insertComment);
     $('.likebtn').on('click', insertLike);
});

function insertComment(){
	//'{"comment":'+ JSON.stringify($("#comment").val())+'}',
    
	$.ajax({
            url: "http://localhost:3000/tweet/"+$(this).data('time'),
            type: 'PUT',    
            data: 'comment='+$("#comment").val(),
            success: function(data) {
    window.location.reload();
  }
});
}

function deleteSubscriber(){
	event.preventDefault();
	
	var confirmation = confirm('Are you sure');
	
	if(confirmation){
		$.ajax({
			type: 'DELETE',
			url: '/subscriber/'+ $('.deletesubscriber').data('email')
		}).done(function(response){
			window.location.replace('/');
		});
	} else{
		return false;
	}
}

 $(document).ready(function(){
	$('.deletetweet').on('click',deleteTweet);

});

function deleteTweet(){
	event.preventDefault();
	
	var confirmation = confirm('Are you sure');
	
	if(confirmation){
		$.ajax({
			type: 'DELETE',
			url: '/tweet/'+ $('.deletetweet').data('time')
		}).done(function(response){
			window.location.replace('/naslovna/');
		});
	} else{
		return false;
	}
}

function insertLike(){
	//'{"comment":'+ JSON.stringify($("#comment").val())+'}',
    alert($(this).data('time'));
	$.ajax({
            url: "/likes/"+$(this).data('time'),
            type: 'PUT',    
            data: 'likes='+$(this).data('session'),
            success: function(data) {
    window.location.reload();
  }
});
}