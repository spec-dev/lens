import { LiveObject, Spec, Property, BlockHash, Address, BlockNumber, Timestamp, ChainId, SpecEvent } from 'https://esm.sh/@spec.dev/core@0.0.19'
import { OnLensHub } from '../shared/events.ts'

/**
 * A Comment on Lens.
 */
@Spec({
    table: 'lens.comments',
    uniqueBy: ['profileId', 'pubId', 'chainId']
})
class Comment extends LiveObject {
    // The token id of the profile that made the comment (the commentor).
    @Property()
    profileId: number
    
    // The id of the comment.
    @Property()
    pubId: number

    // The token id of the profile this comment points to.
    @Property()
    toProfileId: number

    // The id of the publication this comment points to.
    @Property()
    toPubId: number

    // URI pointing to the specific content the comment contains.
    @Property()
    contentUri: string

    // The address of the comment's collect module.
    @Property()
    collectModule: Address

    // The data returned from the collect module's initialization.
    @Property()
    collectModuleReturnData: string

    // The address of the comment's reference module.
    @Property()
    referenceModule: Address

    // The data passed to the reference module.
    @Property()
    referenceModuleData: string

    // The data returned from the reference module's initialization.
    @Property()
    referenceModuleReturnData: string
    
    // The block hash in which the comment was created.
    @Property()
    blockHash: BlockHash

    // The block number in which the comment was created.
    @Property()
    blockNumber: BlockNumber

    // The block timestamp in which the comment was created.
    @Property({ primaryTimestamp: true })
    blockTimestamp: Timestamp

    // The blockchain id.
    @Property()
    chainId: ChainId

    //-----------------------------------------------------
    //  EVENT HANDLERS
    //-----------------------------------------------------

    @OnLensHub('CommentCreated')
    createComment(event: SpecEvent) {
        this.profileId = event.data.profileId
        this.pubId = event.data.pubId
        this.toProfileId = event.data.profileIdPointed
        this.toPubId = event.data.pubIdPointed
        this.contentUri = event.data.contentURI
        this.collectModule = event.data.collectModule
        this.collectModuleReturnData = event.data.collectModuleReturnData
        this.referenceModule = event.data.referenceModule
        this.referenceModuleData = event.data.referenceModuleData
        this.referenceModuleReturnData = event.data.referenceModuleReturnData
        this.blockHash = event.data.blockHash
        this.blockNumber = event.data.blockNumber
        this.blockTimestamp = event.data.blockTimestamp
        this.chainId = event.data.chainId
    }
}

export default Comment