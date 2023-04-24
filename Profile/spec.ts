import { LiveObject, Spec, Property, OnAllEvents, OnEvent, Event, Address, Timestamp, saveAll } from '@spec.dev/core'

/**
 * A Lens Profile NFT.
 */
@Spec({
    table: 'lens.profiles',
    uniqueBy: ['profileId', 'chainId']
})
class Profile extends LiveObject {
    // The profile's token id.
    @Property()
    profileId: number
    
    // The address of the profile's owner.
    @Property()
    ownerAddress: Address
    
    // The whitelisted address that created the profile.
    @Property()
    creatorAddress: Address

    // The address of the profile's dispatcher (opt-in).
    @Property()
    dispatcherAddress: Address

    // The profile's @handle.
    @Property()
    handle: string

    // The URI of the profile's image.
    @Property()
    imageUri: string

    // The address of the profile's follow module.
    @Property()
    followModuleAddress: Address

    // The data returned from the follow module's initialization.
    @Property()
    followModuleReturnData: string
    
    // The URI of the profile's follow NFT.
    @Property()
    followNftUri: string

    // Whether this is the owner's default Lens profile.
    @Property()
    isDefault: boolean

    // The block timestamp in which the profile was created.
    @Property({ canUpdate: false })
    createdAt: Timestamp

    //-----------------------------------------------------
    //  EVENT HANDLERS
    //-----------------------------------------------------

    @OnAllEvents()
    setCommonProperties(event: Event) {
        this.profileId = event.data.profileId
    }

    @OnEvent('lens.LensHubProxy.ProfileCreated')
    createProfile(event: Event) {
        this.ownerAddress = event.data.to
        this.creatorAddress = event.data.creator
        this.handle = event.data.handle
        this.imageUri = event.data.imageURI
        this.followModuleAddress = event.data.followModule
        this.followModuleReturnData = event.data.followModuleReturnData
        this.followNftUri = event.data.followNFTURI
        this.createdAt = event.data.blockTimestamp
    }

    @OnEvent('lens.LensHubProxy.DispatcherSet')
    updateDispatcher(event: Event) {
        this.dispatcherAddress = event.data.dispatcher
    }

    @OnEvent('lens.LensHubProxy.ProfileImageURISet')
    updateImageUri(event: Event) {
        this.imageUri = event.data.imageURI
    }

    @OnEvent('lens.LensHubProxy.FollowModuleSet')
    updateFollowModule(event: Event) {
        this.followModuleAddress = event.data.followModule
        this.followModuleReturnData = event.data.followModuleReturnData
    }

    @OnEvent('lens.LensHubProxy.FollowNFTURISet')
    updateFollowNftUri(event: Event) {
        this.followNftUri = event.data.followNFTURI
    }

    @OnEvent('lens.LensHubProxy.DefaultProfileSet')
    async switchDefaultProfiles(event: Event) {
        // Get existing default profile.
        const prevDefaultProfile = await this.findOne(Profile, {
            ownerAddress: event.data.wallet,
            chainId: event.data.chainId,
            isDefault: true,
        })
        if (prevDefaultProfile?.profileId === this.profileId) return

        this.isDefault = true

        // Just save the new default profile if one didn't already exist.
        if (!prevDefaultProfile) {
            await this.save()
            return
        }

        // Save both in parallel.
        prevDefaultProfile.isDefault = false
        await saveAll(this, prevDefaultProfile)
    }
}

export default Profile