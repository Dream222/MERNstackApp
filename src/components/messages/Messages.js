import React, { Component } from 'react';
import ReactNotifications from 'react-browser-notifications';

let browserstate=1;

export default class Messages extends Component {
	constructor(props) {
	  super(props);
		
		this.scrollDown = this.scrollDown.bind(this)
		this.showNotifications = this.showNotifications.bind(this);
    	this.handleClick = this.handleClick.bind(this);
    	window.addEventListener('focus', function() {
		    browserstate=1;
		    document.title = 'Slack Chat APP';
		});
		  
		window.addEventListener('blur', function() {
		    browserstate=0;
		    // document.title = '*';
		});
	}

    showNotifications() {
      // If the Notifications API is supported by the browser
      // then show the notification
      if(this.notify.supported()) this.notify.show();
    }

	handleClick(event) {
	 
	    this.notify.close(event.target.tag);
	}


	scrollDown(){
		const { container } = this.refs
		container.scrollTop = container.scrollHeight
	}

	componentDidMount() {
		this.scrollDown()
	}

	componentDidUpdate(prevProps, prevState) {
		this.scrollDown()
		this.showNotifications()
		if(browserstate == 0){
			document.title = '*'
		}
	}
	
	render() {
		const { messages, user, typingUsers } = this.props 
		return (
			<div ref='container' className="thread-container">
				<div className="thread">
					{
						messages.map((mes)=>{
							return (
								<div
									key={mes.id}
									className={`message-container ${mes.sender === user.name && 'right'}`}
								>
									<div className="time">{mes.time}</div>
									<div className="data">
										<div className="message">{mes.message}</div>
										<div className="name">{mes.sender}</div>
									</div>
								</div>

								)
						})
					}
					{
						typingUsers.map((name)=>{
							return (
								<div key={name} className="typing-user">
									{`${name} is typing . . .`}
								</div>
							)
						})
					}

					<div>
			 
				        <ReactNotifications
				          onRef={ref => (this.notify = ref)} 
				          title="Hey There!" 
				          body={`${user.name} sent new messages . . .`}
				          icon="icon.png"
				          tag="abcdef"
				          timeout="2000"
				          onClick={event => this.handleClick(event)}
				        />
				 
				 
				    </div>
				</div>

			


			</div>
		);
	}
}
