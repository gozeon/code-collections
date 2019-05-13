import {
  Pane,
  Text,
  TextInput,
  Strong,
  TextInputField,
  SideSheet,
  Paragraph,
  Position,
  Button,
  SearchInput,
  Heading,
  Spinner,
  toaster,
  Tooltip,
  Code,
  Pre,
  Link
} from "evergreen-ui";
import Head from "next/head";

function OwnHeading(props) {
  return (
    <Heading size={props.size} marginTop={20} marginBottom={20}>
      {props.title}
    </Heading>
  );
}

function OwnPre(props) {
  return (
    <Pre
      padding={20}
      style={{
        background: "#F7F9FD"
      }}
    >
      {props.code}
    </Pre>
  );
}

function Doc() {
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
        <OwnHeading title="Browser" size={900} />
          <Pane>
            <Link
              href={process.env.API + "/test"}
              marginRight={12}
              color="neutral"
            >
              {process.env.API}/test
            </Link>
          </Pane>
          <OwnHeading title="Curl" size={900} />
          <OwnPre code={`curl -X GET ${process.env.API}/test`}></OwnPre>
          <OwnHeading title="API" size={900} />
          <OwnHeading title="Get all url" />
          <OwnPre code={`curl -X GET ${process.env.API}/api/mock`}></OwnPre>
          <OwnHeading title="Create new url" />
          <OwnPre
            code={`curl -X POST ${
              process.env.API
            }/api/mock -H 'Content-Type:application/json' -d '{"path":"/test","data":{a:1}}'`}
          />
        </Pane>
      </Pane>
    </Pane>
  );
}

export default Doc;
