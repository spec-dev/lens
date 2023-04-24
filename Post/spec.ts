import { LiveObject, Spec, Property, Address, OnEvent, Event } from '@spec.dev/core'

/**
 * A Post on Lens.
 */
@Spec({ 
    table: 'lens.posts',
    uniqueBy: ['profileId', 'pubId', 'chainId'] 
})
class Post extends LiveObject {
    // The token id of the profile that made the post.
    @Property()
    profileId: number
    
    // The id of the post.
    @Property()
    pubId: number

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
    
    // ==== Event Handlers ===================

    @OnEvent('lens.LensHubProxy.PostCreated')
    createPost(event: Event) {
        this.profileId = event.data.profileId
        this.pubId = event.data.pubId
        this.contentUri = event.data.contentURI
        this.collectModule = event.data.collectModule
        this.collectModuleReturnData = event.data.collectModuleReturnData
        this.referenceModule = event.data.referenceModule
        this.referenceModuleReturnData = event.data.referenceModuleReturnData
    }
}

export default Post