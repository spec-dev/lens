import { LiveObject, Spec, Property, On, BeforeOn, BlockHash, Address, BlockNumber, Timestamp, ChainId, SpecEvent, saveAll } from 'https://esm.sh/@spec.dev/core@0.0.17'

// LensHub contract events.
const OnLensHub = (event: string) => On(`contracts.lens.LensHubProxy.${event}`)

/**
 * A Lens Profile NFT.
 */
@Spec({ 
    table: 'lens.profiles',
    uniqueBy: ['profileId', 'chainId']
})
class Profile extends LiveObject {
    // The profile's token id (referred to as "profileId" on Lens).
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
    
    // The URI of the profile's follow NFT
    @Property()
    followNftUri: string

    // Whether this is the owner's default Lens profile.
    @Property()
    isDefault: boolean

    // The block timestamp in which the profile NFT was created.
    @Property()
    createdAt: Timestamp

    // The block hash in which the profile was last updated.
    @Property()
    blockHash: BlockHash

    // The block number in which the profile was last updated.
    @Property()
    blockNumber: BlockNumber

    // The block timestamp in which the profile was last updated.
    @Property({ primaryTimestamp: true })
    blockTimestamp: Timestamp

    // The blockchain id.
    @Property()
    chainId: ChainId

    //-----------------------------------------------------
    //  EVENT HANDLERS
    //-----------------------------------------------------

    @BeforeOn()
    setCommonProperties(event: SpecEvent) {
        this.profileId = event.data.profileId
        this.blockHash = event.data.blockHash
        this.blockNumber = event.data.blockNumber
        this.blockTimestamp = event.data.blockTimestamp
        this.chainId = event.data.chainId
    }

    @OnLensHub('ProfileCreated')
    async createProfile(event: SpecEvent) {
        this.ownerAddress = event.data.to
        this.creatorAddress = event.data.creator
        this.handle = event.data.handle
        this.imageUri = event.data.imageURI
        this.followModuleAddress = event.data.followModule
        this.followModuleReturnData = event.data.followModuleReturnData
        this.followNftUri = event.data.followNFTURI
        this.createdAt = event.data.blockTimestamp
        await this.save()
    }

    @OnLensHub('DispatcherSet')
    async updateDispatcher(event: SpecEvent) {
        this.dispatcherAddress = event.data.dispatcher
        await this.save()
    }

    @OnLensHub('ProfileImageURISet')
    async updateImageUri(event: SpecEvent) {
        this.imageUri = event.data.imageURI
        await this.save()
    }

    @OnLensHub('FollowModuleSet')
    async updateFollowModule(event: SpecEvent) {
        this.followModuleAddress = event.data.followModule
        this.followModuleReturnData = event.data.followModuleReturnData
        await this.save()
    }

    @OnLensHub('FollowNFTURISet')
    async updateFollowNftUri(event: SpecEvent) {
        this.followNftUri = event.data.followNFTURI
        await this.save()
    }

    @OnLensHub('DefaultProfileSet')
    async switchDefaultProfiles(event: SpecEvent) {      
        this.isDefault = true

        // Get owner's previous default profile.
        const prevDefaultProfile = await this.findOne(Profile, {
            ownerAddress: event.data.wallet,
            chainId: event.data.chainId,
            isDefault: true,
        })
        if (prevDefaultProfile.profileId === this.profileId) {
            return
        }

        // Just save the new default profile if it's the only one.
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