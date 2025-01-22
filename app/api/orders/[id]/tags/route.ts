import { OrderModel } from "@/models/OrderModel";
import { TagModel } from "@/models/TagsModel";

export async function GET (req: Request){}
type Params = Promise<{ id: string }>;

export async function POST (req: Request,{ params }: { params:Params }) {
    const  {id}  = await params
    const { name } = await req.json()
    try {
        let tag = await TagModel.getByName(name)
        if (!tag) {
            tag = await TagModel.create({ name: name })
        }
        
        // Then, add the tag to the order
        await OrderModel.addTag(id, tag.id)
        
        console.log("TAG POST", name, tag)
        return Response.json(tag)
    } catch (error) {
        return Response.json({ error: 'Err' }, {status:500})
    }
}