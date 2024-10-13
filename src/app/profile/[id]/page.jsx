import { signOut } from "../../../../auth"
import ProfileInfo from "./(Component)/ProfileInfo"

export default function page() {

  return (
    <div className='pt-20'>
      <ProfileInfo />
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button className="btn btn-primary" type="submit">Sign Out</button>
      </form>
    </div>
  )
}
