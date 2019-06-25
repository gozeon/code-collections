import React from 'react';
import {
    Pane,
    Button,
    Heading,
    SearchInput,
    Spinner,
    Text,
    SideSheet,
    Position,
    toaster
} from "evergreen-ui";

import logo from './166521.png';

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSearching: false,
            isShown: false,
            searchData: [1, 2, 3, 4, 5, 6, 7, 8,3,4,5,6,7,7,8,9,9,0,0,0,2,23, 8,3,4,5,6,7,7,8,9,9,0,0,0,2,23, 8,3,4,5,6,7,7,8,9,9,0,0,0,2,23,2]
        }

        this.search = this.search.bind(this)
    }

    search(event) {
        const q = event.target.value;
        toaster.notify(`search ${q}`)
    }

    render() {
        const {isSearching, searchData, isShown} = this.state
        return (
            <Pane>
                <Pane display="flex" justifyContent="flex-end" padding={16}>
                    <Button appearance="minimal" is="a" href="/document" marginRight={20}>
                        Document
                    </Button>
                </Pane>

                <Heading
                    size={900}
                    marginTop={30}
                    style={{
                        textAlign: "center",
                        height: "80px",
                        lineHeight: "80px",
                        verticalAlign: "middle"
                    }}
                >
                    <img
                        src={logo}
                        style={{
                            width: 47,
                            height: 47,
                            marginRight: 20,
                            verticalAlign: "text-bottom"
                        }}
                        alt="my logo"
                    />
                    Title
                </Heading>

                <Pane marginTop={50} marginLeft="auto" marginRight="auto" marginBottom={50} width="90%">
                    <Pane
                        style={{
                            /* eslint-disable no-dupe-keys */
                            position: "-webkit-sticky",
                            position: "sticky",
                            top: "1px"
                            /*eslint-enable */
                        }}
                    >
                        <SearchInput
                            placeholder="Search url..."
                            height={50}
                            width="100%"
                            onChange={this.search}
                        />
                    </Pane>

                    {isSearching ?
                        <Pane
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height={400}
                        >
                            <Spinner/>
                        </Pane>
                        :
                        <Pane
                            marginTop={50}
                            marginLeft={"auto"}
                            marginRight={"auto"}
                            width="90%"
                            display="flex"
                            flexWrap="wrap"
                            justifyContent="space-evenly"
                        >
                            {searchData.length > 0
                                ?
                                searchData.map((item,index) =>
                                    <Pane
                                        key={index}
                                        height={120}
                                        width={240}
                                        border="default"
                                        marginBottom={15}
                                        onClick={() => this.setState({isShown: true})}
                                    >
                                        <Text>{item}</Text>
                                    </Pane>)
                                :
                                <Pane
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    height={100}
                                    width="100%"
                                >
                                    <Text>No Match</Text>
                                </Pane>}
                        </Pane>}

                </Pane>

                <SideSheet
                    position={Position.RIGHT}
                    isShown={isShown}
                    onCloseComplete={() => this.setState({isShown: false})}
                >
                    <Text>Hello World</Text>
                </SideSheet>
            </Pane>
        );
    }
}

export default Search;
