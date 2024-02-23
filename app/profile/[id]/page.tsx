
export default function UserProfile({params}: any) {
    return (
        <div>
            <h1>Profile Page
            <span className="p-2 rounded bg-red-500">{params.id}</span>
            </h1>
        </div>
    )
}