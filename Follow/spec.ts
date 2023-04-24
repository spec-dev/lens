import { LiveObject, Spec, Property, Address, Timestamp, OnEvent, Event } from '@spec.dev/core'

/**
 * A Lens Follow NFT.
 */
@Spec({
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
    @Property({ canUpdate: false })
    createdAt: Timestamp

    // ==== Event Handlers ===================

    @OnEvent('lens.LensHubProxy.FollowNFTTransferred')
    onFollow(event: Event) {
        this.profileId = event.data.profileId
        this.followNftId = event.data.followNFTId
        this.followerAddress = event.data.to
        this.createdAt = event.data.blockTimestamp
    }
}

export default Follow