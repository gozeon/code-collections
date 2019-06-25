import React from "react";

import {
    Pane,
    Tooltip,
    Button
} from "evergreen-ui";

class Document extends React.Component {
    render() {
        return (
            <Pane>
                <Pane display="flex" padding={16}>
                    <Tooltip content="Back to Home">
                        <Button
                            appearance="minimal"
                            is="a"
                            href="/"
                            iconBefore="arrow-left"
                        >
                            Home
                        </Button>
                    </Tooltip>
                </Pane>

                <Pane>
                    Document
                </Pane>
            </Pane>
        )
    }
}

export default Document