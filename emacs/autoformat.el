;; Автоформатування js/ts/go при збереженні
(add-hook 'before-save-hook 'eglot-format-buffer nil t)
