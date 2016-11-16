$(function () {

    // Declare a proxy to reference the hub. 
    var chat = $.connection.chatHub;
    var user = document.getElementById("uname").value;

        // Create a function that the hub can call to broadcast messages.
        chat.client.sentMessage = function (name, message, time) {
            // Codifica nombre y mensajes con HTML 
            var encodedName = $('<div />').text(name).html();
            var encodedMsg = $('<div />').text(message).html();
            var encodedTime = $('<div />').text(time).html();
            // Añade mensaje a la pagina
            $('#discussion').append('<li class="i">' +
                '<div class="head enviado">' +
                    '<span class="name">' + encodedName + '  </span>' +
                    '<span class="time">' + time + '</span>' +
                '</div>' +
                '<div class="enviado message">' + encodedMsg + '</div>' +
            '</li>');

            autoscroll();
        };

        // Create a function that the hub can call to broadcast messages.
        chat.client.receivedMessage = function (name, message, time) {
            // Codifica nombre y mensajes con HTML 
            var encodedName = $('<div />').text(name).html();
            var encodedMsg = $('<div />').text(message).html();
            var encodedTime = $('<div />').text(time).html();
            // Añade mensaje a la pagina
            $('#discussion').append('<li class="i">' +
                '<div class="head recibido">' +
                    '<span class="name">' + encodedName + '  </span>' +
                    '<span class="time">' + time + '</span>' +
                '</div>' +
                '<div class="recibido message">' + encodedMsg + '</div>' +
            '</li>');

            autoscroll();
        };

        chat.client.onNewUserConnected = function (username) {
            $('#discussion').append('<strong>Usuario ' + username
                + ' conectado.</strong><hr />');
            autoscroll();
            var encodedName = $('<div />').text(username).html();

            $('#list-users').append('<li>' +
                '<img width="50" height="50" src="assets/images/usuario.jpg">' +
                '<div class="info">' +
                '<div class="user"><a href="javascript:register_popup(\'' + username + ' \', \'' + username + '\');">' + encodedName + '</a></div>' +
                    '<div class="status on"> online</div>' +
                    '</div></li>');
        }

        chat.client.onConnected = function (name) {
            $.each(name, function (index, usuario) {
                var encodedName = $('<div />').text(usuario.username).html();

                $('#list-users').append('<li>' +
                    '<img width="50" height="50" src="assets/images/usuario.jpg">' +
                    '<div class="info">' +
                        '<div class="user"><a href="javascript:register_popup(\'' + usuario.username + ' \', \'' + usuario.username + '\');">' + encodedName + '</a></div>' +
                        '<div class="status on"> online</div>' +
                        '</div></li>');
            });
        }

        chat.client.onUserDisconnected = function (username) {
            $('#list-users li').each(function () {
                if ($(this).find('.user').text() == username)
                    $(this).remove();
            });

            $('#discussion').append('<strong>Usuario ' + username
                + ' desconectado.</strong><hr />');
            autoscroll();
            autoscroll();
        }

        chat.client.sentPrivateMessage = function (toUserId, fromUser, message) {

        }

        chat.client.receivedPrivateMessage = function (fromUser, message) {

        }

        // Get the user name and store it to prepend to messages.
        $('#displayname').val(user);

        // Set initial focus to message input box.  
        $('#message').focus();
        // Start the connection.
        $.connection.hub.start().done(function () {
            chat.server.connect(user);
            var message = document.getElementById("message");
            message.addEventListener("keydown", function (e) {
                if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
                    e.preventDefault();
                    // Call the Send method on the hub. 
                    chat.server.send($('#displayname').val(), $('#message').val());
                    // Clear text box and reset focus for next comment. 
                    $('#message').val('').focus();
                    return false;
                }
            });

            $('#sendmessage').click(function () {
                // Call the Send method on the hub. 
                chat.server.send($('#displayname').val(), $('#message').val());
                // Clear text box and reset focus for next comment. 
                $('#message').val('').focus();
            });
        });    
});