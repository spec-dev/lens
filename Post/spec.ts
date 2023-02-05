import { LiveObject, Spec, Property, BlockHash, Address, BlockNumber, Timestamp, ChainId, SpecEvent } from 'https://esm.sh/@spec.dev/core@0.0.19'
import { OnLensHub } from '../shared/events.ts'

/**
 * A Post on Lens.
 */
@Spec({
    table: 'lens.posts',
    uniqueBy: ['pubId', 'profileId', 'chainId']
})
class Post extends LiveObject {
    // The id of the post.
    @Property()
    pubId: number
    
    // The token id of the profile NFT in which this post was published.
    @Property()
    profileId: number
    
    // URI pointing to the specific content the publication contains.
    @Property()
    contentUri: string

    // The address of the post's collect module.
    @Property()
    collectModule: Address

    // The data returned from the collect module's initialization.
    @Property()
    collectModuleReturnData: string

    // The address of the post's reference module.
    @Property()
    referenceModule: Address

    // The data returned from the reference module's initialization.
    @Property()
    referenceModuleReturnData: string
    
    // The block hash in which the post was created.
    @Property()
    blockHash: BlockHash

    // The block number in which the post was created.
    @Property()
    blockNumber: BlockNumber

    // The block timestamp in which the post was created.
    @Property({ primaryTimestamp: true })
    blockTimestamp: Timestamp

    // The blockchain id.
    @Property()
    chainId: ChainId

    //-----------------------------------------------------
    //  EVENT HANDLERS
    //-----------------------------------------------------

    @OnLensHub('PostCreated')
    createPost(event: SpecEvent) {
        this.profileId = event.data.profileId
        this.pubId = event.data.pubId
        this.contentUri = event.data.contentURI
        this.collectModule = event.data.collectModule
        this.collectModuleReturnData = event.data.collectModuleReturnData
        this.referenceModule = event.data.referenceModule
        this.referenceModuleReturnData = event.data.referenceModuleReturnData
        this.blockHash = event.data.blockHash
        this.blockNumber = event.data.blockNumber
        this.blockTimestamp = event.data.blockTimestamp
        this.chainId = event.data.chainId
    }
}

export default Post