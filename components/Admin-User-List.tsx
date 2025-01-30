'use client'
import { Button } from "./ui/button";
import { updateUserRole } from "@/lib/actions";


export default function AdminUserList({ users }: { users: {id: string, name: string, role: string, email:string}[], }) {
    
    return( 
        <div>
        {users.map((user: {id: string, name: string, role: string, email:string} ) => (
            <User key={user.id} user={user}  />
          ))}
          </div>
    )
  }

function User({user}:{user : {id: string, name: string, role: string, email:string}} ) {

    return (
        <form key={user.id} action={updateUserRole}>
            <input type="text" name="id" value={user.id} readOnly />
            <input type="text" name="name" value={user.name} readOnly />
            <input type="text" name="role" value={user.role} readOnly />
            <input type="text" name="email" value={user.email} readOnly />
              <p>
                {user.role === "admin" ? (
                  <Button type="submit">Remove Admin</Button>
                ) : (
                  <Button type="submit">Make Admin</Button>
                )}
              </p>
              <hr className="my-2" />
        </form>

    )
}