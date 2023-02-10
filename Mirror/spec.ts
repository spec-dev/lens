import { LiveObject, Spec, Property, BlockHash, Address, BlockNumber, Timestamp, ChainId, SpecEvent } from 'https://esm.sh/@spec.dev/core@0.0.28'
import { OnLensHub } from '../shared/events.ts'

/**
 * A Mirror on Lens.
 */
@Spec({
    namespace: 'lens',
    name: 'Mirror',
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
    
    // The block hash in which the mirror was created.
    @Property()
    blockHash: BlockHash

    // The block number in which the mirror was created.
    @Property()
    blockNumber: BlockNumber

    // The block timestamp in which the mirror was created.
    @Property({ primaryTimestamp: true })
    blockTimestamp: Timestamp

    // The blockchain id.
    @Property()
    chainId: ChainId

    //-----------------------------------------------------
    //  EVENT HANDLERS
    //-----------------------------------------------------

    @OnLensHub('MirrorCreated')
    createMirror(event: SpecEvent) {
        this.profileId = event.data.profileId
        this.pubId = event.data.pubId
        this.toProfileId = event.data.profileIdPointed
        this.toPubId = event.data.pubIdPointed
        this.referenceModule = event.data.referenceModule
        this.referenceModuleData = event.data.referenceModuleData
        this.referenceModuleReturnData = event.data.referenceModuleReturnData
        this.blockHash = event.data.blockHash
        this.blockNumber = event.data.blockNumber
        this.blockTimestamp = event.data.blockTimestamp
        this.chainId = event.data.chainId
    }
}

export default Mirror