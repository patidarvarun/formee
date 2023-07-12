import React, { Component } from 'react';

class UnAuthorizedAccess extends Component {
	render() {
		const { location } = this.props;
		return (
			<div className='d-flex  error-404'>
				{location.pathname !== '/' ? <div className='sf-pagenotfound row h-100 justify-content-center align-items-center align-self-center'>
					<div className='col-sm-12 sf-notfoundtext'>
						<div className='text-center'>
							<h1 className='error404-text'>401</h1>
							<h2>Un-authorized</h2>
							<p>Sorry, you are un-authorize user to access this page.</p>
							<a href='/'>Back to Home</a>
						</div>
					</div>
				</div> : <div />}
				<style jsx>{`
				 .error-404{
					justify-content: center;
					align-items: center;
					height: 100vh;
				 }
				 .error404-text{font-size:6rem; color:red;}
				`}</style>
			</div>
		);
	}
}


export default UnAuthorizedAccess;