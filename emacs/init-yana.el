;; Швидко відкрити core-директорії проекту з Emacs
(defun yana-open-main ()
  (interactive)
  (dired "~/Projects/Yana.Diia/src"))

(defun yana-open-api ()
  (interactive)
  (dired "~/Projects/Yana.Diia/api"))
