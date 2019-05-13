import React from "react";
import Head from "next/head";
import { isEqual } from "lodash";
import {
  Pane,
  Text,
  SideSheet,
  Paragraph,
  Position,
  Button,
  SearchInput,
  Heading,
  Spinner,
  toaster
} from "evergreen-ui";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/zh-cn";
import dynamic from "next/dynamic";

// import SearchInput from "../components/searchInput";
// const SearchInput = dynamic(
//   () => import("evergreen-ui").then(module => module.SearchInput),
//   {
//     ssr: false
//   }
// );

// const Heading = dynamic(
//   () => import("evergreen-ui").then(module => module.Heading),
//   {
//     ssr: false
//   }
// );

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShown: false,
      isSearch: true,
      isShownFetch: false,
      openUri: "",
      openData: {},
      urlData: [],
      searchData: [],
      editorTheme: {
        default: "#D4D4D4",
        background: "#F9F9FB",
        background_warning: "#FEECEB",
        string: "#FA7921",
        number: "#70CE35",
        colon: "#49B8F7",
        keys: "#59A5D8",
        keys_whiteSpace: "#835FB6",
        primitive: "#386FA4"
      }
    };

    this.search = this.search.bind(this);
    this.showUpdate = this.showUpdate.bind(this);
    this.update = this.update.bind(this);
  }

  showUpdate(uri) {
    this.setState({
      isShown: true,
      isShownFetch: true,
      openUri: uri
    });

    import("../events/mock").then(module => {
      module
        .getData(this.state.openUri)
        .then(data => this.setState({ openData: data, isShownFetch: false }))
        .catch(error => toaster.danger("搜索失败"));
    });
  }

  update(data) {
    if (data.error) {
      return;
    }

    const { openData } = this.state;

    if (isEqual(data["jsObject"], openData)) {
      return;
    }

    import("../events/mock").then(module => {
      module
        .create(this.state.openUri, data["jsObject"] || {})
        .then(response => {
          if (response["result"] === "ok") {
            toaster.success("修改成功");
            this.setState({
              openData: response["data"]
            });
          } else {
            toaster.danger("修改失败");
          }
        })
        .catch(error => toaster.danger("修改失败"));
    });
  }

  search(event) {
    const q = event.target.value;

    this.setState({
      isSearch: true
    });

    if (!q) {
      this.setState({
        searchData: this.state.urlData,
        isSearch: false
      });
    } else {
      import("../events/search").then(module => {
        module
          .Search(this.state.searchData, q)
          .then(data => this.setState({ searchData: data, isSearch: false }))
          .catch(error => toaster.danger("搜索失败"));
      });
    }
    // const k = event.which || event.keyCode;
    // if (k === 13) {
    //   this.setState({
    //     isSearch: true
    //   });
    //   if (!q) {
    //     this.setState({
    //       searchData: this.state.urlData,
    //       isSearch: false
    //     });
    //   } else {
    //     import("../events/search").then(module => {
    //       module
    //         .Search(this.state.searchData, q)
    //         .then(d => this.setState({ searchData: d, isSearch: false }));
    //     });
    //   }
    // }
  }
  componentDidMount() {
    this.setState({
      isSearch: true
    });
    import("../events/mock").then(module => {
      module
        .getAllPath()
        .then(response =>
          this.setState({
            urlData: response.data,
            searchData: response.data,
            isSearch: false
          })
        )
        .catch(err => toaster.danger("path列表获取失败"));
    });
  }

  render() {
    const {
      isShown,
      isSearch,
      urlData,
      searchData,
      editorTheme,
      openData
    } = this.state;

    return (
      <Pane>
        <Head>
          <title>SMock</title>
        </Head>

        <Pane>
          <Pane display="flex" justifyContent="flex-end" padding={16}>
            <Button appearance="minimal" is="a" href="/create" marginRight={20}>
              New Mock
            </Button>
            <Button appearance="minimal" is="a" href="/doc" marginRight={20}>
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
              src="/static/166521.png"
              style={{
                width: 47,
                height: 47,
                marginRight: 20,
                verticalAlign: "text-bottom"
              }}
              alt="my image"
            />
            Mock
          </Heading>
        </Pane>

        <Pane marginTop={50} marginLeft="auto" marginRight="auto" width="90%">
          <Pane
            style={{
              position: "-webkit-sticky",
              position: "sticky",
              top: "1px"
            }}
          >
            <SearchInput
              placeholder="Search url..."
              height={50}
              width="100%"
              onChange={this.search}
            />
          </Pane>
          {isSearch ? (
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
              marginTop={40}
              marginLeft={"auto"}
              marginRight={"auto"}
              width="90%"
            >
              {searchData.length > 0 ? (
                searchData.map(uri => (
                  <Pane
                    key={uri}
                    background="tint1"
                    padding={10}
                    marginBottom={5}
                    cursor="pointer"
                    hoverElevation={3}
                    onClick={e => this.showUpdate(uri)}
                  >
                    <Text>{uri}</Text>
                  </Pane>
                ))
              ) : (
                <Pane
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height={100}
                >
                  <Text>No Match</Text>
                </Pane>
              )}
            </Pane>
          )}

          <SideSheet
            position={Position.RIGHT}
            isShown={isShown}
            onCloseComplete={() => this.setState({ isShown: false })}
          >
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <JSONInput
                id="a_unique_id"
                placeholder={openData}
                colors={editorTheme}
                locale={locale}
                height="100%"
                width="100%"
                onChange={data => this.update(data)}
              />
            </Pane>
          </SideSheet>
        </Pane>
      </Pane>
    );
  }
}

export default Index;
