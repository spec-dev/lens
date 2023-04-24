import { LiveObject, Spec, Property, Address, OnEvent, Event } from '@spec.dev/core'

/**
 * A Mirror on Lens.
 */
@Spec({
    table: 'lens.mirrors',
    uniqueBy: ['profileId', 'pubId', 'chainId']
})
class Mirror extends LiveObject {
    // The token id of the profile that created the mirror.
    @Property()
    profileId: number
    
    // The id of the mirror.
    @Property()
    pubId: number

    // The token id of the profile this mirror points to.
    @Property()
    toProfileId: number

    // The id of the publication being mirrored.
    @Property()
    toPubId: number

    // The address of the mirror's reference module.
    @Property()
    referenceModule: Address

    // The data passed to the reference module.
    @Property()
    referenceModuleData: string

    // The data returned from the reference module's initialization.
    @Property()
    referenceModuleReturnData: string
    
    // ==== Event Handlers ===================

    @OnEvent('lens.LensHubProxy.MirrorCreated')
    createMirror(event: Event) {
        this.profileId = event.data.profileId
        this.pubId = event.data.pubId
        this.toProfileId = event.data.profileIdPointed
        this.toPubId = event.data.pubIdPointed
        this.referenceModule = event.data.referenceModule
        this.referenceModuleData = event.data.referenceModuleData
        this.referenceModuleReturnData = event.data.referenceModuleReturnData
    }
}

export default Mirror