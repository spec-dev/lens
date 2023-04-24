import { LiveObject, Spec, Property, Address, OnEvent, Event } from '@spec.dev/core'

/**
 * A Comment on Lens.
 */
@Spec({
    table: 'lens.comments',
    uniqueBy: ['profileId', 'pubId', 'chainId']
})
class Comment extends LiveObject {
    // The profile token id that posted the comment.
    @Property()
    profileId: number
    
    // The id of the comment.
    @Property()
    pubId: number

    // The profile token id that this comment points to.
    @Property()
    toProfileId: number

    // The publication id that this comment points to.
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

    // ==== Event Handlers ===================

    @OnEvent('lens.LensHubProxy.CommentCreated')
    createComment(event: Event) {
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
    }
}

export default Comment