import { LSTween } from "LSTween.lspkg/LSTween";

@component
export class AsrControl extends BaseScriptComponent {
    private asrModule = require("LensStudio:AsrModule");

    @input
    displayText!: Text;

    onAwake(): void {
        if (!this.displayText) return;

        const options = AsrModule.AsrTranscriptionOptions.create(); 
        options.silenceUntilTerminationMs = 1000; 
        options.mode = AsrModule.AsrMode.HighAccuracy; 

        // Подписываемся на обновления текста распознавания [1, 2, 6]
        options.onTranscriptionUpdateEvent.add((eventArgs) => {
            this.onTranscriptionUpdate(eventArgs);
        });

        options.onTranscriptionErrorEvent.add((eventArgs) => {
            this.onTranscriptionError(eventArgs);
        });

        // Запускаем распознавание речи [1, 2, 6]
        this.asrModule.startTranscribing(options);
    }

    private onTranscriptionUpdate(eventArgs: AsrModule.TranscriptionUpdateEvent): void { 
        // 1. Выводим текущий распознанный текст прямо на экран [1-3]
        this.displayText.text = eventArgs.text;

        // 2. Дополнительный визуальный эффект: меняем цвет текста с помощью LSTween, когда фраза зафиксирована (isFinal)
        if (eventArgs.isFinal) {
            // Подсвечиваем финальную фразу зеленым цветом [7]
            LSTween.colorTextTo(this.displayText, new vec4(0, 1, 0, 1), 300).start(); [7]
        } else {
            // Для промежуточного распознавания оставляем белый цвет [7]
            LSTween.colorTextTo(this.displayText, new vec4(1, 1, 1, 1), 100).start(); [7]
        }
    }

    private onTranscriptionError(errorCode: AsrModule.AsrStatusCode): void {
        print(`Ошибка ASR: ${errorCode}`);
    }
}