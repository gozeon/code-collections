import React from "react";
import Head from "next/head";
import {
  Pane,
  TextInputField,
  Button,
  Heading,
  Spinner,
  toaster,
  Tooltip
} from "evergreen-ui";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/zh-cn";

class Creat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isInvalid: true,
      newPath: "",
      newData: {
        data: {},
        error: {
          returnCode: 0,
          returnMessage: "success",
          returnUserMessage: "成功"
        }
      },
      newDataInvalid: false,
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

    this.create = this.create.bind(this);
  }

  create() {
    this.setState({
      isLoading: true
    });
    import("../events/mock").then(module => {
      module
        .create(this.state.newPath, this.state.newData || {})
        .then(response => {
          if (response["result"] === "ok") {
            toaster.success("创建成功");
            this.setState({
              isLoading: false
            });
          } else {
            toaster.danger("创建失败");
          }
        })
        .catch(error => toaster.danger("创建失败"));
    });
  }

  render() {
    const {
      newData,
      editorTheme,
      newPath,
      isInvalid,
      newDataInvalid,
      isLoading
    } = this.state;
    return (
      <Pane>
        <Head>
          <title>Create New Mock</title>
        </Head>

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
          <Pane marginTop={50} marginLeft="auto" marginRight="auto" width="60%">
            <TextInputField
              isInvalid={isInvalid}
              required
              label="Url"
              placeholder="/a/b/c..."
              validationMessage={null}
              value={newPath}
              onChange={e =>
                this.setState({
                  newPath: e.target.value,
                  isInvalid: e.target.value.length <= 0
                })
              }
            />
            <Heading is="h3" marginBottom={10}>
              Response Data *
            </Heading>
            {/* <Strong marginBottom={10}>Response Data *</Strong> */}
            <JSONInput
              id="a_unique_id"
              placeholder={newData}
              colors={editorTheme}
              locale={locale}
              height="100%"
              width="100%"
              onChange={data =>
                this.setState({
                  newData: data.jsObject,
                  newDataInvalid: !!data.error
                })
              }
            />
            <Button
              marginTop={50}
              intent="none"
              disabled={isInvalid || newDataInvalid}
              onClick={this.create}
            >
              {isLoading ? <Spinner size={20} marginLeft={6} /> : "Create"}
            </Button>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}
export default Creat;
