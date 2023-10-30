INSERT INTO `users` (`user_id`, `no`, `username`, `password`, `phone_no`, `account_name`, `account_no`, `role`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
('02b25dc9-b995-4ed8-8d94-a03d241aee89', 1, 'ah_keong', 'abc12345', '', '', '', 'SUPERVISOR', 1, 'MASTER-001', '2023-10-05 15:07:17', '2023-10-08 05:33:52'),
('24515e4f-ad3e-4824-a9a5-f4baf309c39b', 3, 'John Cena', 'abc12345', '', '', '', 'AGENT', 1, 'MASTER-001', '2023-10-06 14:15:45', '2023-10-08 05:34:05'),
('3273bc39-0afe-403e-bfe2-3b8c28a4f917', 8, 'sasuke', 'abc123', '', '', '', 'SUPERVISOR', 1, 'MASTER-001', '2023-10-07 16:50:51', '2023-10-07 16:50:51'),
('43cdffb1-678a-4a63-8796-06c3e1396076', 2, 'johnson', 'abc123', '', '', '', 'SUPERVISOR', 1, 'MASTER-001', '2023-10-05 15:07:34', '2023-10-08 05:33:58'),
('5817a13b-f284-463a-944b-dc0952358062', 5, 'edison', 'abc123', '', '', '', 'SUPERVISOR', 1, 'MASTER-001', '2023-10-07 16:45:38', '2023-10-07 16:45:38'),
('70312f21-e87c-4d6c-9073-859d53ac7063', 6, 'jennifer', 'abc123', '', '', '', 'AGENT', 1, 'MASTER-001', '2023-10-07 16:47:57', '2023-10-07 16:47:57'),
('81eea6bd-1917-4c9b-8c4d-5dff03bf1d74', 1, 'ah_huat', 'abc123', '', '', '', 'AGENT', 0, '43cdffb1-678a-4a63-8796-06c3e1396076', '2023-10-05 15:09:12', '2023-10-08 05:33:48'),
('8779d0af-adcd-481c-b827-8da2cb174687', 3, 'qi_sheng', 'abc123', '', '', '', 'AGENT', 1, '43cdffb1-678a-4a63-8796-06c3e1396076', '2023-10-05 15:09:36', '2023-10-08 05:34:09'),
('8d566052-05f9-4e9a-9cbd-ebe5af621239', 1, 'jenny', 'abc123', '', '', '', 'AGENT', 1, '02b25dc9-b995-4ed8-8d94-a03d241aee89', '2023-10-05 15:08:42', '2023-10-08 05:33:55'),
('af651058-ec4d-4e24-8ddd-54082d514ab6', 2, 'menny', 'abc123', '', '', '', 'AGENT', 1, '02b25dc9-b995-4ed8-8d94-a03d241aee89', '2023-10-05 15:08:50', '2023-10-08 05:34:01'),
('bce50e2c-08d5-440e-9885-70026c1540ab', 4, 'Kenny', 'abc123', '', '', '', 'SUPERVISOR', 1, 'MASTER-001', '2023-10-07 16:37:30', '2023-10-08 05:34:12'),
('c74fb1f9-300f-4a80-91e2-3cdc88f9d1c4', 7, 'holuken', 'abc123', '', '', '', 'AGENT', 1, 'MASTER-001', '2023-10-07 16:49:17', '2023-10-08 05:34:17'),
('d17a0a5f-ea33-4266-bb02-0866a2b5bd28', 2, 'ah_lian', 'abc123', NULL, NULL, NULL, 'AGENT', 1, '43cdffb1-678a-4a63-8796-06c3e1396076', '2023-10-05 15:09:21', '2023-10-05 15:09:21'),
('f6000dc0-9473-4567-97be-ed43a2dc0a5b', 9, 'lekx', 'abc123', '999', '', '', 'SUPERVISOR', 1, 'MASTER-001', '2023-10-08 06:32:48', '2023-10-08 06:32:57'),
('MASTER-001', 1, 'master', 'abc12345', NULL, NULL, NULL, 'MASTER', 1, NULL, '2023-10-05 17:05:45', '2023-10-05 17:05:45');

INSERT INTO `members` (`member_id`, `no`, `nickname`, `full_name`, `mykad_number`, `phone_1`, `phone_2`, `address_1`, `address_2`, `address_3`, `postcode`, `town`, `state`, `country`, `created_by`, `created_at`, `updated_at`) VALUES
('053adc75-1cc6-4506-bd8a-73c09567bc71', 1, 'Ampang大哥', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Malaysia', '02b25dc9-b995-4ed8-8d94-a03d241aee89', '2023-10-05 15:12:17', '2023-10-05 15:12:17'),
('14c8a3d6-18e4-4ac8-b506-c07bcfce86f9', 1, '飙哥', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 'Malaysia', '8d566052-05f9-4e9a-9cbd-ebe5af621239', '2023-10-08 11:08:25', '2023-10-08 11:08:25'),
('1ef9dc6d-c22e-4139-a824-8d7222ad65bc', 2, 'Satay佬', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Malaysia', 'd17a0a5f-ea33-4266-bb02-0866a2b5bd28', '2023-10-05 15:11:29', '2023-10-05 15:11:29'),
('60d9d2bf-a51a-4f5f-aa05-225ee01c3a09', 1, '傻强', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Malaysia', 'd17a0a5f-ea33-4266-bb02-0866a2b5bd28', '2023-10-05 15:11:18', '2023-10-05 15:11:18');
