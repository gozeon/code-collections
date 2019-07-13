import React from 'react'
import { NextPageContext } from 'next'

export interface PostProps {
  id: number;
}

export default class Post extends React.Component<PostProps>{
  static async getInitialProps(ctx: NextPageContext) {
    const {id} = ctx.query
    return {id}
  }

  render() {
    return <div>{this.props.id}</div>
  }
}