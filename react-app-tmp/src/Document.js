import React from "react";
import marked from "marked";
import { Pane, Button, Spinner } from "evergreen-ui";
import { Link } from "react-router-dom";

import "./doc.css";

// import readme from "./doc.md";

class Document extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			doc: "",
			isloading: false
		};
		this.getMarkdownText = this.getMarkdownText.bind(this);
	}

	componentDidMount() {
		this.setState({ isloading: true });
		fetch("https://raw.githubusercontent.com/gozeon/code-collections/master/react-app-tmp/README.md")
			.then(res => res.text())
			.then(doc => this.setState({ doc: doc, isloading: false }));
	}

	getMarkdownText() {
		const rawMarkup = marked(this.state.doc, { sanitize: true });
		return { __html: rawMarkup };
	}

	render() {
		const { isloading } = this.state;
		return (
			<Pane>
				<Pane display="flex" padding={16}>
					<Button appearance="minimal" is={Link} to="/" iconBefore="arrow-left">
						Home
					</Button>
				</Pane>
				{isloading ? (
					<Pane
						display="flex"
						alignItems="center"
						justifyContent="center"
						height={400}
					>
						<Spinner />
					</Pane>
				) : (
					<Pane
						width="70%"
						marginTop={50}
						marginLeft="auto"
						marginRight="auto"
						dangerouslySetInnerHTML={this.getMarkdownText()}
					/>
				)}
			</Pane>
		);
	}
}

export default Document;
