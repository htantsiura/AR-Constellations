@component
export class ScriptsHolder extends BaseScriptComponent {

    @input
    myScripts!: ScriptAsset[]
    
    onAwake() {
    }
}
