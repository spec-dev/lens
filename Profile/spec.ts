import { LiveObject, Spec, Property, On, BlockHash, Address, BlockNumber, Timestamp, StringKeyMap, ChainId, SpecEvent } from 'https://esm.sh/@spec.dev/core@0.0.9'

/**
 * A Lens Profile NFT.
 */
@Spec({ 
    table: 'lens.profiles',
    uniqueBy: [['profileId', 'chainId'], ['handle', 'chainId']]
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

    // The address of the profile's follow NFT.
    @Property()
    followNftAddress: Address
    
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

    @On('contracts.lens.LensHubProxy.ProfileCreated')
    async createProfile(event: SpecEvent) {
        const data = event.data as StringKeyMap
        this.profileId = data.profileId
        this.ownerAddress = data.to
        this.creatorAddress = data.creator
        this.handle = data.handle
        this.imageUri = data.imageURI
        this.followModuleAddress = data.followModule
        this.followModuleReturnData = data.followModuleReturnData
        this.followNftAddress = null // Get from contract
        this.followNftUri = data.followNFTURI
        this.createdAt = data.blockTimestamp
        this._setBlockProperties(data)
        await this.save()
    }

    @On('contracts.lens.LensHubProxy.DispatcherSet')
    async updateDispatcher(event: SpecEvent) {
        const data = event.data as StringKeyMap
        this._setEventAgnosticProperties(data)
        this.dispatcherAddress = data.dispatcher
        await this.save()
    }

    @On('contracts.lens.LensHubProxy.ProfileImageURISet')
    async updateImageUri(event: SpecEvent) {
        const data = event.data as StringKeyMap
        this._setEventAgnosticProperties(data)
        this.imageUri = data.imageURI
        await this.save()
    }

    @On('contracts.lens.LensHubProxy.FollowModuleSet')
    async updateFollowModule(event: SpecEvent) {
        const data = event.data as StringKeyMap
        this._setEventAgnosticProperties(data)
        this.followModuleAddress = data.followModule
        this.followModuleReturnData = data.followModuleReturnData
        await this.save()
    }
    
    @On('contracts.lens.LensHubProxy.FollowNFTDeployed')
    async updateFollowNftAddress(event: SpecEvent) {
        const data = event.data as StringKeyMap
        this._setEventAgnosticProperties(data)
        this.followNftAddress = data.followNFT
        await this.save()
    }

    @On('contracts.lens.LensHubProxy.FollowNFTURISet')
    async updateFollowNftUri(event: SpecEvent) {
        const data = event.data as StringKeyMap
        this._setEventAgnosticProperties(data)
        this.followNftUri = data.followNFTURI
        await this.save()
    }

    @On('contracts.lens.LensHubProxy.DefaultProfileSet')
    async switchDefaultProfiles(event: SpecEvent) {
        const data = event.data as StringKeyMap
        this._setEventAgnosticProperties(data)
        
        // Get owner's current default profile.
        const existingDefaultProfile = await this.findOneBy({
            ownerAddress: data.wallet,
            chainId: data.chainId,
            isDefault: true,
        })

        // Set new default profile.
        this.isDefault = true
        const updates = [this.save()]

        // Tell previous default profile it's not the default anymore.
        if (existingDefaultProfile) {
            existingDefaultProfile.isDefault = false
            updates.push(existingDefaultProfile.save())
        }

        await Promise.all(updates)
    }

    //-----------------------------------------------------
    //  HELPERS
    //-----------------------------------------------------

    _setEventAgnosticProperties(data: StringKeyMap) {
        this.profileId = data.profileId
        this._setBlockProperties(data)
    }

    _setBlockProperties(data: StringKeyMap) {
        this.blockHash = data.blockHash
        this.blockNumber = data.blockNumber
        this.blockTimestamp = data.blockTimestamp
        this.chainId = data.chainId
    }
}

export default Profile