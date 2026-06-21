-- Обновляем существующие stories и добавляем новые
UPDATE t_p35950310_project_zenith_2127.stories SET
  title = '🎁 Розыгрыш!',
  subtitle = 'iPhone 17 + сертификаты до 10 000 ₽. Акция НАЧАТА! Совершите ремонт от 3 500 ₽ и участвуй!',
  image_url = 'https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/bucket/d818cd17-a1fc-4556-96ac-9243e84e2d83.png',
  link_url = '/giveaway',
  link_label = 'Участвовать',
  gradient_from = '#f59e0b',
  gradient_to = '#ef4444',
  sort_order = 0
WHERE id = 1;

UPDATE t_p35950310_project_zenith_2127.stories SET
  title = '⚡ Ремонт за 1 ч',
  subtitle = 'Заменим экран, аккумулятор или разъём прямо при вас. Диагностика 0 ₽.',
  image_url = 'https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/files/c08dc48b-2e30-4193-993a-56744db25416.jpg',
  link_url = '/calculator',
  link_label = 'Рассчитать',
  gradient_from = '#1d4ed8',
  gradient_to = '#0891b2',
  sort_order = 1
WHERE id = 2;

UPDATE t_p35950310_project_zenith_2127.stories SET
  title = '🛡️ Гарантия 365 дн',
  subtitle = 'Гарантия до 365 дней на все виды ремонта. Если что-то пойдёт не так — починим бесплатно.',
  image_url = 'https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/files/bae05299-9833-4cb6-854a-7024b8021cca.jpg',
  link_url = '/warranty',
  link_label = 'Подробнее',
  gradient_from = '#059669',
  gradient_to = '#0891b2',
  sort_order = 2
WHERE id = 3;

UPDATE t_p35950310_project_zenith_2127.stories SET
  title = '⭐ Бонусы 5–10%',
  subtitle = 'Получайте от 5 до 10% бонусами с каждого ремонта. 1 бонус = 1 рубль.',
  image_url = 'https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/files/d0410ba3-f22a-46bd-bc70-896b1f2f5c2b.jpg',
  link_url = '/privileges',
  link_label = 'Узнать больше',
  gradient_from = '#7c3aed',
  gradient_to = '#db2777',
  sort_order = 3
WHERE id = 4;

-- Новые истории
INSERT INTO t_p35950310_project_zenith_2127.stories (title, subtitle, image_url, link_url, link_label, gradient_from, gradient_to, is_active, sort_order)
VALUES
(
  '📱 Магазин техники',
  'iPhone, MacBook, iPad, аксессуары. Оригинальная техника по честным ценам с гарантией.',
  'https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/files/c8e591d4-a6ab-46a8-bc4a-e7ffcf85a4e7.jpg',
  '/shop', 'В магазин', '#0ea5e9', '#6366f1', TRUE, 4
),
(
  '💻 MacBook & iMac',
  'Ремонт MacBook любой сложности: замена SSD, матрицы, клавиатуры. Быстро и надёжно.',
  'https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/files/bae05299-9833-4cb6-854a-7024b8021cca.jpg',
  '/device/macbook', 'Записаться', '#1e293b', '#475569', TRUE, 5
),
(
  '📍 Мы в Барнауле',
  'ул. Молодёжная 34, 1 этаж. Пн–Пт 11:00–20:00, Сб 12:00–18:00. Приходи — встретим!',
  'https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/files/bccdbeea-9c78-4e7e-b57b-92affa7d3f09.jpg',
  '/contacts', 'Как добраться', '#16a34a', '#065f46', TRUE, 6
)
ON CONFLICT DO NOTHING;