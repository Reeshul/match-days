import React from "react";

const Location = () => {
	return (
		<div>
			<form>
				Chuck your address here
				<br />
				<input></input>
				<button
					title='locationSubmit'
					onClick={e => {
						e.preventDefault();
					}}
				>
					Submit
				</button>
			</form>
		</div>
	);
};

export default Location