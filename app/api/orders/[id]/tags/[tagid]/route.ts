import { TagModel } from "@/models/TagsModel";

type Params= Promise<{ id: string, tagid:string }>;
export async function DELETE (req: Request,{ params }: { params:Params }) {
    const  {id, tagid }  = await params
    try {
           await TagModel.delete(tagid)
           return Response.json({ message: 'Tag deleted successfully' }, { status: 200 })
      } catch (error) {
        console.error(`Error in DELETE /api/orders/${id}/tags/${tagid}:`, error)
        return Response.json({ error: "Internal Server Error" }, { status: 500 })
      }
}