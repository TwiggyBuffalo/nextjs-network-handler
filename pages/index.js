import { get } from '../request-handler'
import routes from '../routes'

const index = (props) => {
  console.log(props)
  const Posts = props.post.map(({title}, index) => <p key={index}>{title}</p>)
  return (
    <div>
      { Posts }
    </div>
  )
}

index.getInitialProps = async function () {
  const post = await get(routes.posts)
  const posts = await get([routes.posts, routes.posts])
  return {
    post,
    posts,
  }
  //return {events: await get(routes.events)}
}

export default index