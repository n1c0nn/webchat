using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;


namespace WebChat
{
    public class ChatHub : Hub
    {
        private static List<Usuario> ConnectedUsers = new List<Usuario>();

        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            if (stopCalled)  {

                var item = ConnectedUsers.FirstOrDefault(x => x.idConexion == Context.ConnectionId);
                if (item != null)
                {
                    ConnectedUsers.Remove(item);
                    Clients.All.onUserDisconnected(item.username);

                }
            } else  {
                
            }

            return base.OnDisconnected(stopCalled);
        }

        

        public void Connect(string username)
        {
            var id = Context.ConnectionId;

            if (ConnectedUsers.Count(x => x.idConexion == id) == 0)
            {

                ConnectedUsers.Add(new Usuario { idConexion = id, username = username });

                // send to caller
                Clients.Caller.onConnected(ConnectedUsers);

                // send to all except caller client
                Clients.AllExcept(id).onNewUserConnected(username);

            }

        }


        public void SendPrivateMessage(string toUsername, string message)
        {

            string fromUserId = Context.ConnectionId;

            var toUser = ConnectedUsers.FirstOrDefault(x => x.username == toUsername);
            var fromUser = ConnectedUsers.FirstOrDefault(x => x.idConexion == fromUserId);

            if (toUser != null && fromUser != null)
            {
                // send to
                Clients.Client(toUser.idConexion).sendPrivateMessage(fromUserId, fromUser.username, message);

                // send to caller user
                Clients.Caller.sentPrivateMessage(toUser.idConexion, fromUser.username, message);
            }

        }

        public void Send(string name, string message)
        {
            var id = Context.ConnectionId;

            DateTime thisDay = DateTime.Now;
            string format = @"dd\/MM\/yyyy HH:mm";

            // Call the broadcastMessage method to update caller.
            Clients.Caller.sentMessage(name, message,
                thisDay.ToString(format));

            // Call the broadcastMessage method to update other clients.
            Clients.AllExcept(id).receivedMessage(name, message, 
                thisDay.ToString(format));
        }
    }
}