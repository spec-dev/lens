import { LiveObject, Spec, Property, BlockHash, Address, BlockNumber, Timestamp, ChainId, SpecEvent } from 'https://esm.sh/@spec.dev/core@0.0.27'
import { OnLensHub } from '../shared/events.ts'

/**
 * A Lens Follow NFT.
 */
@Spec({
    namespace: 'lens',
    table: 'lens.follows',
    uniqueBy: ['profileId', 'followNftId', 'chainId']
})
class Follow extends LiveObject {
    // The token id of the profile followed.
    @Property()
    profileId: number
    
    // The token id of the follow NFT.
    @Property()
    followNftId: number

    // The address of the follower.
    @Property()
    followerAddress: Address
    
    // The block timestamp in which the follow NFT was created.
    @Property({ update: false })
    createdAt: Timestamp

    // The block hash in which the follow NFT was last updated.
    @Property()
    blockHash: BlockHash

    // The block number in which the follow NFT was last updated.
    @Property()
    blockNumber: BlockNumber

    // The block timestamp in which the follow NFT was last updated.
    @Property({ primaryTimestamp: true })
    blockTimestamp: Timestamp

    // The blockchain id.
    @Property()
    chainId: ChainId

    //-----------------------------------------------------
    //  EVENT HANDLERS
    //-----------------------------------------------------

    @OnLensHub('FollowNFTTransferred')
    onFollow(event: SpecEvent) {
        this.profileId = event.data.profileId
        this.followNftId = event.data.followNFTId
        this.followerAddress = event.data.to
        this.createdAt = event.data.blockTimestamp
        this.blockHash = event.data.blockHash
        this.blockNumber = event.data.blockNumber
        this.blockTimestamp = event.data.blockTimestamp
        this.chainId = event.data.chainId
    }
}

export default Follow