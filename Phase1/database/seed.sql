-- USERS TABLE SEED DATA
-- 110 records:
--   - 1 admin
--   - 40 writers
--   - 69 readers
INSERT IGNORE INTO users (id, username, password, email, bio, profile_picture, date_joined, role) VALUES

(1, 'alex_wright', 'Adm!n@2023', 'alex.wright@gmail.com', 'Platform administrator. Keeping the community safe and thriving.', 'https://i.pravatar.cc/150?img=1', '2023-01-01 08:00:00', 'admin'),

(2, 'maya_stone', 'Myst!c99xA', 'maya.stone@gmail.com', 'Fantasy fiction and poetry lover. Published author of 3 novels.', 'https://i.pravatar.cc/150?img=2', '2023-01-08 14:30:00', 'writer'),
(3, 'liam_foster', 'Li@mFos23', 'liam.foster@gmail.com', 'Sci-fi and thriller reviewer. Bookworm and coffee addict.', 'https://i.pravatar.cc/150?img=3', '2023-01-10 10:00:00', 'writer'),
(4, 'sophia_lane', 'SLane@2k3', 'sophia.lane@gmail.com', 'Librarian by day, mystery writer by night.', 'https://i.pravatar.cc/150?img=12', '2023-01-15 14:00:00', 'writer'),
(5, 'noah_brooks', 'No@hBr0ks', 'noah.brooks@gmail.com', 'Sports journalist and weekend hiker. Writing about life outdoors.', 'https://i.pravatar.cc/150?img=5', '2023-01-18 08:45:00', 'writer'),
(6, 'henry_shaw', 'HSha!w567', 'henry.shaw@gmail.com', 'Military historian. Published author of three books.', 'https://i.pravatar.cc/150?img=17', '2023-01-22 10:10:00', 'writer'),
(7, 'harper_bell', 'HBel!23xQ', 'harper.bell@gmail.com', 'Children book illustrator and author. Bringing stories to life.', 'https://i.pravatar.cc/150?img=20', '2023-01-25 09:50:00', 'writer'),
(8, 'ella_grant', 'EGra@nt22', 'ella.grant@gmail.com', 'Environmental activist and nature photographer.', 'https://i.pravatar.cc/150?img=22', '2023-01-28 14:45:00', 'writer'),
(9, 'luna_scott', 'LuSc@tt99', 'luna.scott@gmail.com', 'Romance novelist and bookstagram creator.', 'https://i.pravatar.cc/150?img=24', '2023-02-01 16:30:00', 'writer'),
(10, 'zoe_morgan', 'ZMorg@n11', 'zoe.morgan@gmail.com', 'Psychologist and self-help book author.', 'https://i.pravatar.cc/150?img=26', '2023-02-04 10:40:00', 'writer'),
(11, 'lily_baker', 'LBak@r789', 'lily.baker@gmail.com', 'Romance and drama screenwriter. Coffee shop regular.', 'https://i.pravatar.cc/150?img=28', '2023-02-07 09:30:00', 'writer'),
(12, 'penelope_gray', 'PGr@y456', 'penelope.gray@gmail.com', 'Art critic and museum curator. Living for aesthetics.', 'https://i.pravatar.cc/150?img=32', '2023-02-10 15:00:00', 'writer'),
(13, 'victoria_lewis', 'VLew!s21', 'victoria.lewis@gmail.com', 'Corporate lawyer and legal advice columnist.', 'https://i.pravatar.cc/150?img=34', '2023-02-13 12:40:00', 'writer'),
(14, 'aurora_young', 'AYou@ng5', 'aurora.young@gmail.com', 'Astrophysics PhD student and science writer.', 'https://i.pravatar.cc/150?img=36', '2023-02-16 14:20:00', 'writer'),
(15, 'violet_martinez', 'VM@rt567', 'violet.martinez@gmail.com', 'Poet and short story writer. Words are my world.', 'https://i.pravatar.cc/150?img=48', '2023-02-19 15:10:00', 'writer'),
(16, 'iris_clark', 'ICl@rk88', 'iris.clark@gmail.com', 'Graphic novelist and comic art creator.', 'https://i.pravatar.cc/150?img=50', '2023-02-22 12:00:00', 'writer'),
(17, 'ruby_wilson', 'RWil@s99', 'ruby.wilson@gmail.com', 'Pediatrician and parenting blogger.', 'https://i.pravatar.cc/150?img=52', '2023-02-25 14:20:00', 'writer'),
(18, 'claire_moore', 'CMoo@r77', 'claire.moore@gmail.com', 'Art teacher and painting workshop host.', 'https://i.pravatar.cc/150?img=56', '2023-02-28 10:00:00', 'writer'),
(19, 'flora_williams', 'FWil@m44', 'flora.williams@gmail.com', 'Environmental journalist and activist.', 'https://i.pravatar.cc/150?img=58', '2023-03-03 09:50:00', 'writer'),
(20, 'pearl_davis', 'PDav!s33', 'pearl.davis@gmail.com', 'Vintage fashion collector and style blogger.', 'https://i.pravatar.cc/150?img=62', '2023-03-06 12:30:00', 'writer'),
(21, 'vera_rodriguez', 'VRod@r55', 'vera.rodriguez@gmail.com', 'Translator and literary critic.', 'https://i.pravatar.cc/150?img=64', '2023-03-09 15:00:00', 'writer'),
(22, 'celeste_brown', 'CBro@n66', 'celeste.brown@gmail.com', 'Astrologer and spiritual wellness blogger.', 'https://i.pravatar.cc/150?img=68', '2023-03-12 08:10:00', 'writer'),
(23, 'meadow_jones', 'MJon@s77', 'meadow.jones@gmail.com', 'Herbalist and natural remedies blogger.', 'https://i.pravatar.cc/150?img=70', '2023-03-15 11:10:00', 'writer'),
(24, 'eden_wilson', 'EWil@n88', 'eden.wilson@gmail.com', 'Homeschooling parent and educational content creator.', 'https://i.pravatar.cc/150?img=72', '2023-03-18 12:20:00', 'writer'),
(25, 'storm_davies', 'SDav@s22', 'storm.davies@gmail.com', 'Meteorologist and weather science writer.', 'https://i.pravatar.cc/150?img=74', '2023-03-21 15:30:00', 'writer'),
(26, 'lake_brown', 'LBro@n55', 'lake.brown@gmail.com', 'Wildlife photographer and conservation blogger.', 'https://i.pravatar.cc/150?img=84', '2023-03-24 09:30:00', 'writer'),
(27, 'crest_navarro', 'CNav@r44', 'crest.navarro@gmail.com', 'Naval officer turned memoir writer.', 'https://i.pravatar.cc/150?img=86', '2023-03-27 08:20:00', 'writer'),
(28, 'terra_miller', 'TMil@r99', 'terra.miller@gmail.com', 'Geologist and science fiction author.', 'https://i.pravatar.cc/150?img=87', '2023-03-30 14:40:00', 'writer'),
(29, 'luna_hayes', 'LHay@s11', 'luna.hayes@gmail.com', 'Night sky photographer and space blogger.', 'https://i.pravatar.cc/150?img=89', '2023-04-02 12:20:00', 'writer'),
(30, 'star_thomas', 'STho@s33', 'star.thomas@gmail.com', 'Science teacher and STEM education blogger.', 'https://i.pravatar.cc/150?img=91', '2023-04-05 11:00:00', 'writer'),
(31, 'flux_martin', 'FMar@n77', 'flux.martin@gmail.com', 'Quantum computing researcher and tech blogger.', 'https://i.pravatar.cc/150?img=95', '2023-04-08 10:50:00', 'writer'),
(32, 'byte_rodriguez', 'BRod@z88', 'byte.rodriguez@gmail.com', 'Blockchain developer and crypto writer.', 'https://i.pravatar.cc/150?img=97', '2023-04-11 09:00:00', 'writer'),
(33, 'prism_anderson', 'PAnd@s22', 'prism.anderson@gmail.com', 'Photography teacher and color theory writer.', 'https://i.pravatar.cc/150?img=106', '2023-04-14 14:40:00', 'writer'),
(34, 'lens_cooper', 'LCoo@r55', 'lens.cooper@gmail.com', 'Cinematographer and film blogger.', 'https://i.pravatar.cc/150?img=107', '2023-04-17 09:00:00', 'writer'),
(35, 'cut_harrison', 'CHar@s99', 'cut.harrison@gmail.com', 'Film editor and narrative structure analyst.', 'https://i.pravatar.cc/150?img=109', '2023-04-20 10:40:00', 'writer'),
(36, 'reel_harris', 'RHar@s44', 'reel.harris@gmail.com', 'Independent filmmaker and script consultant.', 'https://i.pravatar.cc/150?img=110', '2023-04-23 15:00:00', 'writer'),
(37, 'james_reed', 'JRee@d77', 'james.reed@gmail.com', 'Podcast host and journalist covering climate change.', 'https://i.pravatar.cc/150?img=11', '2023-04-26 10:30:00', 'writer'),
(38, 'oscar_thomas', 'OTho@s11', 'oscar.thomas@gmail.com', 'Retired teacher now writing historical fiction.', 'https://i.pravatar.cc/150?img=41', '2023-04-29 09:10:00', 'writer'),
(39, 'finn_white', 'FWhi@t66', 'finn.white@gmail.com', 'Software architect and technical writer.', 'https://i.pravatar.cc/150?img=43', '2023-05-02 10:00:00', 'writer'),
(40, 'hazel_harris', 'HHar@s55', 'hazel.harris@gmail.com', 'Journalist covering arts and culture.', 'https://i.pravatar.cc/150?img=44', '2023-05-05 14:30:00', 'writer'),
(41, 'jasper_lee', 'JLee@s33', 'jasper.lee@gmail.com', 'Outdoor survival guide author and former soldier.', 'https://i.pravatar.cc/150?img=65', '2023-05-08 09:30:00', 'writer'),


(42, 'sara_hill', 'Sara@H123', 'sara.hill@gmail.com', 'Love exploring ideas. Philosophy major turned data scientist.', 'https://i.pravatar.cc/150?img=4', '2023-01-12 11:20:00', 'user'),
(43, 'emma_cole', 'EmC0@le77', 'emma.cole@gmail.com', 'UX designer and amateur watercolor artist.', 'https://i.pravatar.cc/150?img=6', '2023-01-16 16:00:00', 'user'),
(44, 'ava_martin', 'AvaMar@t8', 'ava.martin@gmail.com', 'Fitness enthusiast and healthy living advocate.', 'https://i.pravatar.cc/150?img=8', '2023-01-20 07:30:00', 'user'),
(45, 'ethan_ross', 'ERoss@123', 'ethan.ross@gmail.com', 'Full-stack developer browsing for good reads.', 'https://i.pravatar.cc/150?img=9', '2023-01-23 12:00:00', 'user'),
(46, 'isabella_day', 'IDay@9876', 'isabella.day@gmail.com', 'Travel enthusiast and aspiring blogger.', 'https://i.pravatar.cc/150?img=10', '2023-01-26 09:45:00', 'user'),
(47, 'william_carr', 'WCar@5543', 'william.carr@gmail.com', 'Economist and policy wonk. Loves numbers and graphs.', 'https://i.pravatar.cc/150?img=13', '2023-01-29 09:00:00', 'user'),
(48, 'benjamin_fox', 'BFox@2211', 'benjamin.fox@gmail.com', 'Amateur astronomer and science enthusiast.', 'https://i.pravatar.cc/150?img=15', '2023-02-01 08:20:00', 'user'),
(49, 'charlotte_kim', 'CKim@3344', 'charlotte.kim@gmail.com', 'Fashion lover and sustainable living advocate.', 'https://i.pravatar.cc/150?img=16', '2023-02-04 15:40:00', 'user'),
(50, 'amelia_west', 'AWest@112', 'amelia.west@gmail.com', 'Yoga enthusiast and mindfulness student.', 'https://i.pravatar.cc/150?img=18', '2023-02-07 07:00:00', 'user'),
(51, 'lucas_price', 'LPri@8899', 'lucas.price@gmail.com', 'Indie game fan and pixel art enthusiast.', 'https://i.pravatar.cc/150?img=19', '2023-02-10 13:30:00', 'user'),
(52, 'mason_ward', 'MWar@4455', 'mason.ward@gmail.com', 'Home chef and food lover.', 'https://i.pravatar.cc/150?img=21', '2023-02-13 12:20:00', 'user'),
(53, 'jackson_wood', 'JWoo@6677', 'jackson.wood@gmail.com', 'Cybersecurity student and CTF enthusiast.', 'https://i.pravatar.cc/150?img=23', '2023-02-16 11:15:00', 'user'),
(54, 'aiden_cook', 'ACoo@9911', 'aiden.cook@gmail.com', 'Music lover and hobbyist guitarist.', 'https://i.pravatar.cc/150?img=25', '2023-02-19 08:00:00', 'user'),
(55, 'carter_james', 'CJam@3322', 'carter.james@gmail.com', 'Political science student and debate lover.', 'https://i.pravatar.cc/150?img=27', '2023-02-22 14:00:00', 'user'),
(56, 'ryan_adams', 'RAda@1199', 'ryan.adams@gmail.com', 'Stock market follower and personal finance reader.', 'https://i.pravatar.cc/150?img=29', '2023-02-25 11:50:00', 'user'),
(57, 'chloe_evans', 'CEva@7788', 'chloe.evans@gmail.com', 'Language student and polyglot wannabe.', 'https://i.pravatar.cc/150?img=30', '2023-02-28 13:00:00', 'user'),
(58, 'daniel_hughes', 'DHug@5566', 'daniel.hughes@gmail.com', 'Sports fan and fantasy football player.', 'https://i.pravatar.cc/150?img=31', '2023-03-03 08:10:00', 'user'),
(59, 'sebastian_clark', 'SCla@2244', 'sebastian.clark@gmail.com', 'Marine biology student and ocean enthusiast.', 'https://i.pravatar.cc/150?img=33', '2023-03-06 10:20:00', 'user'),
(60, 'jack_walker', 'JWal@8833', 'jack.walker@gmail.com', 'DIY hobbyist and home improvement learner.', 'https://i.pravatar.cc/150?img=35', '2023-03-09 09:00:00', 'user'),
(61, 'leo_king', 'LKin@4411', 'leo.king@gmail.com', 'Entrepreneur exploring startup ideas.', 'https://i.pravatar.cc/150?img=37', '2023-03-12 11:00:00', 'user'),
(62, 'grace_wright', 'GWri@9922', 'grace.wright@gmail.com', 'Nursing student and healthcare reader.', 'https://i.pravatar.cc/150?img=38', '2023-03-15 08:30:00', 'user'),
(63, 'eli_harris', 'EHar@7711', 'eli.harris@gmail.com', 'Photography enthusiast and documentary lover.', 'https://i.pravatar.cc/150?img=39', '2023-03-18 16:00:00', 'user'),
(64, 'scarlett_allen', 'SAlle@334', 'scarlett.allen@gmail.com', 'Interior design student and decor lover.', 'https://i.pravatar.cc/150?img=40', '2023-03-21 12:30:00', 'user'),
(65, 'nora_jackson', 'NJac@5577', 'nora.jackson@gmail.com', 'Vegan lifestyle enthusiast and recipe collector.', 'https://i.pravatar.cc/150?img=42', '2023-03-24 13:50:00', 'user'),
(66, 'levi_grant', 'LGra@8844', 'levi.grant@gmail.com', 'Mechanical engineering student.', 'https://i.pravatar.cc/150?img=45', '2023-03-27 08:00:00', 'user'),
(67, 'stella_thompson', 'STho@1122', 'stella.thompson@gmail.com', 'Nutrition and wellness enthusiast.', 'https://i.pravatar.cc/150?img=46', '2023-03-30 11:20:00', 'user'),
(68, 'hudson_garcia', 'HGar@6699', 'hudson.garcia@gmail.com', 'Adventure sports fan and outdoor reader.', 'https://i.pravatar.cc/150?img=47', '2023-04-02 09:40:00', 'user'),
(69, 'miles_robinson', 'MRob@3388', 'miles.robinson@gmail.com', 'Jazz enthusiast and music history reader.', 'https://i.pravatar.cc/150?img=49', '2023-04-05 10:30:00', 'user'),
(70, 'elliot_davis', 'EDav@7766', 'elliot.davis@gmail.com', 'Data science student and ML enthusiast.', 'https://i.pravatar.cc/150?img=51', '2023-04-08 09:00:00', 'user'),
(71, 'max_taylor', 'MTay@4422', 'max.taylor@gmail.com', 'Philosophy student and ethics reader.', 'https://i.pravatar.cc/150?img=53', '2023-04-11 11:00:00', 'user'),
(72, 'ivy_anderson', 'IAnd@9955', 'ivy.anderson@gmail.com', 'Gardening hobbyist and plant lover.', 'https://i.pravatar.cc/150?img=54', '2023-04-14 08:30:00', 'user'),
(73, 'cole_jackson', 'CJac@2277', 'cole.jackson@gmail.com', 'Basketball fan and sports reader.', 'https://i.pravatar.cc/150?img=55', '2023-04-17 16:00:00', 'user'),
(74, 'eli_johnson', 'EJoh@1188', 'eli.johnson@gmail.com', 'Urban planning student and city enthusiast.', 'https://i.pravatar.cc/150?img=57', '2023-04-20 13:30:00', 'user'),
(75, 'august_brown', 'ABro@5599', 'august.brown@gmail.com', 'Philosophy reader and existentialism fan.', 'https://i.pravatar.cc/150?img=59', '2023-04-23 11:20:00', 'user'),
(76, 'daisy_jones', 'DJon@8866', 'daisy.jones@gmail.com', 'Event planning enthusiast and lifestyle reader.', 'https://i.pravatar.cc/150?img=60', '2023-04-26 14:40:00', 'user'),
(77, 'theo_miller', 'TMil@3311', 'theo.miller@gmail.com', 'Physics student and science explainer fan.', 'https://i.pravatar.cc/150?img=61', '2023-04-29 08:00:00', 'user'),
(78, 'felix_garcia', 'FGar@7744', 'felix.garcia@gmail.com', 'Biotech enthusiast and science reader.', 'https://i.pravatar.cc/150?img=63', '2023-05-02 10:10:00', 'user'),
(79, 'wren_harris', 'WHar@2255', 'wren.harris@gmail.com', 'Digital marketing student.', 'https://i.pravatar.cc/150?img=66', '2023-05-05 13:00:00', 'user'),
(80, 'atlas_johnson', 'AJoh@9988', 'atlas.johnson@gmail.com', 'World traveler and language exchange fan.', 'https://i.pravatar.cc/150?img=67', '2023-05-08 10:40:00', 'user'),
(81, 'river_smith', 'RSmi@4466', 'river.smith@gmail.com', 'Environmental engineering student.', 'https://i.pravatar.cc/150?img=69', '2023-05-11 14:50:00', 'user'),
(82, 'blaze_miller', 'BMil@7733', 'blaze.miller@gmail.com', 'Action film fan and stunt enthusiast.', 'https://i.pravatar.cc/150?img=71', '2023-05-14 09:00:00', 'user'),
(83, 'fox_taylor', 'FTay@1166', 'fox.taylor@gmail.com', 'Extreme sports fan and adventure reader.', 'https://i.pravatar.cc/150?img=73', '2023-05-17 08:40:00', 'user'),
(84, 'dawn_thomas', 'DTho@5522', 'dawn.thomas@gmail.com', 'Early childhood education student.', 'https://i.pravatar.cc/150?img=75', '2023-05-20 10:00:00', 'user'),
(85, 'jade_morrison', 'JMor@8877', 'jade.morrison@gmail.com', 'Gemology student and jewelry design enthusiast.', 'https://i.pravatar.cc/150?img=76', '2023-05-23 13:40:00', 'user'),
(86, 'ray_white', 'RWhi@3344', 'ray.white@gmail.com', 'Radio listener and podcast enthusiast.', 'https://i.pravatar.cc/150?img=77', '2023-05-26 09:20:00', 'user'),
(87, 'brook_harris', 'BHar@6611', 'brook.harris@gmail.com', 'Freshwater ecology enthusiast.', 'https://i.pravatar.cc/150?img=78', '2023-05-29 14:00:00', 'user'),
(88, 'cliff_martin', 'CMar@9977', 'cliff.martin@gmail.com', 'Rock climbing hobbyist and nature reader.', 'https://i.pravatar.cc/150?img=79', '2023-06-01 11:20:00', 'user'),
(89, 'sage_garcia', 'SGar@2288', 'sage.garcia@gmail.com', 'Herbalism and ayurveda student.', 'https://i.pravatar.cc/150?img=80', '2023-06-04 08:00:00', 'user'),
(90, 'vale_rodriguez', 'VRod@7755', 'vale.rodriguez@gmail.com', 'Mountaineering enthusiast and geography reader.', 'https://i.pravatar.cc/150?img=81', '2023-06-07 12:30:00', 'user'),
(91, 'bay_nguyen', 'BNgu@4499', 'bay.nguyen@gmail.com', 'Marine conservation supporter.', 'https://i.pravatar.cc/150?img=82', '2023-06-10 10:50:00', 'user'),
(92, 'glen_johnson', 'GJoh@1133', 'glen.johnson@gmail.com', 'Forester and wilderness enthusiast.', 'https://i.pravatar.cc/150?img=83', '2023-06-13 15:10:00', 'user'),
(93, 'moor_smith', 'MSmi@6688', 'moor.smith@gmail.com', 'Anthropology student and cultural reader.', 'https://i.pravatar.cc/150?img=85', '2023-06-16 13:00:00', 'user'),
(94, 'sol_patel', 'SPat@3355', 'sol.patel@gmail.com', 'Solar energy enthusiast and clean tech fan.', 'https://i.pravatar.cc/150?img=88', '2023-06-19 10:00:00', 'user'),
(95, 'nova_anderson', 'NAnd@7722', 'nova.anderson@gmail.com', 'Astrophotography hobbyist.', 'https://i.pravatar.cc/150?img=90', '2023-06-22 09:40:00', 'user'),
(96, 'comet_jackson', 'CJac@1177', 'comet.jackson@gmail.com', 'Space exploration enthusiast.', 'https://i.pravatar.cc/150?img=92', '2023-06-25 14:20:00', 'user'),
(97, 'orbit_white', 'OWhi@5544', 'orbit.white@gmail.com', 'Aerospace engineering student.', 'https://i.pravatar.cc/150?img=93', '2023-06-28 08:00:00', 'user'),
(98, 'arc_harris', 'AHar@8811', 'arc.harris@gmail.com', 'Electrical engineering student and IoT hobbyist.', 'https://i.pravatar.cc/150?img=94', '2023-07-01 13:30:00', 'user'),
(99, 'pixel_garcia', 'PGar@2266', 'pixel.garcia@gmail.com', 'Digital art fan and creative enthusiast.', 'https://i.pravatar.cc/150?img=96', '2023-07-04 15:10:00', 'user'),
(100, 'chip_lee', 'CLee@9933', 'chip.lee@gmail.com', 'Hardware fan and tech review reader.', 'https://i.pravatar.cc/150?img=98', '2023-07-07 12:40:00', 'user'),
(101, 'node_johnson', 'NJoh@4477', 'node.johnson@gmail.com', 'Backend development learner.', 'https://i.pravatar.cc/150?img=99', '2023-07-10 10:00:00', 'user'),
(102, 'wire_brown', 'WBro@7711', 'wire.brown@gmail.com', 'Network enthusiast and cybersecurity reader.', 'https://i.pravatar.cc/150?img=100', '2023-07-13 14:30:00', 'user'),
(103, 'amp_scott', 'ASco@3388', 'amp.scott@gmail.com', 'Electronics hobbyist and Arduino tinkerer.', 'https://i.pravatar.cc/150?img=60', '2023-07-16 08:00:00', 'user'),
(104, 'volt_jones', 'VJon@6622', 'volt.jones@gmail.com', 'Renewable energy supporter and green reader.', 'https://i.pravatar.cc/150?img=61', '2023-07-19 11:20:00', 'user'),
(105, 'watt_wilson', 'WWil@1155', 'watt.wilson@gmail.com', 'Energy policy reader and analyst fan.', 'https://i.pravatar.cc/150?img=63', '2023-07-22 13:00:00', 'user'),
(106, 'frame_jackson', 'FJac@8844', 'frame.jackson@gmail.com', 'Video editing enthusiast and YouTube fan.', 'https://i.pravatar.cc/150?img=67', '2023-07-25 12:20:00', 'user'),
(107, 'kay_nguyen', 'KNgu@5511', 'kay.nguyen@gmail.com', 'Literature lover and avid reader.', 'https://i.pravatar.cc/150?img=29', '2023-07-28 10:30:00', 'user'),
(108, 'drew_patel', 'DPat@2299', 'drew.patel@gmail.com', 'Technology and culture enthusiast.', 'https://i.pravatar.cc/150?img=30', '2023-07-31 09:00:00', 'user'),
(109, 'quinn_foster', 'QFos@7766', 'quinn.foster@gmail.com', 'Creative writing student and book lover.', 'https://i.pravatar.cc/150?img=31', '2023-08-03 14:00:00', 'user'),
(110, 'blake_morgan', 'BMor@3322', 'blake.morgan@gmail.com', 'History enthusiast and museum visitor.', 'https://i.pravatar.cc/150?img=32', '2023-08-06 11:30:00', 'user');

-- WALLETS TABLE - 110 records

INSERT IGNORE INTO wallets (user_id, coin_balance, updated_at) VALUES
(2,   1240, '2026-02-10 09:45:11'),  
(3,    890, '2026-01-28 16:20:33'),
(4,    320, '2025-11-05 11:15:47'),
(5,    180, '2026-02-05 13:40:09'),
(6,   1670, '2025-09-12 18:55:21'),  
(7,    450, '2025-07-30 10:22:44'),
(8,    780, '2026-01-19 14:08:56'),
(9,    610, '2025-10-22 21:33:17'),
(10,   920, '2026-02-08 08:10:29'),
(11,   540, '2025-08-14 12:47:03'),
(12,  1350, '2026-02-12 15:55:41'), 
(13,   290, '2025-12-03 09:20:14'),
(14,   710, '2025-06-25 17:44:38'),
(15,   830, '2026-01-15 20:10:22'),
(16,   670, '2025-11-18 13:30:55'),
(17,   410, '2025-04-09 10:15:47'),
(18,   560, '2026-02-01 11:28:19'),
(19,   940, '2025-09-30 16:05:33'),
(20,   380, '2025-03-17 08:50:44'),
(21,   720, '2025-10-28 14:22:09'),
(22,  1980, '2026-02-18 19:40:12'),  
(23,   650, '2025-08-07 12:55:31'),
(24,   880, '2026-01-25 09:18:47'),
(25,  1420, '2025-12-20 21:33:08'),
(26,  1150, '2026-02-14 17:10:55'),
(27,   990, '2025-07-11 10:45:22'),
(28,   430, '2025-05-19 15:20:41'),
(29,   810, '2026-01-30 08:35:17'),
(30,   570, '2025-11-09 13:50:29'),
(31,   260, '2026-02-03 11:22:44'),
(32,  1080, '2026-02-19 10:15:33'),  
(33,   190, '2025-06-14 09:40:08'),
(34,   950, '2025-10-31 16:55:19'),
(35,   340, '2026-01-12 14:28:56'),
(36,  1760, '2026-02-09 20:05:47'),
(37,   820, '2025-09-25 11:33:21'),
(38,   510, '2025-04-02 08:20:14'),
(39,   970, '2026-02-16 12:45:39'),
(40,   680, '2025-12-28 17:10:22'),
(41,   860, '2026-01-22 09:55:08'),
(42,    45, '2026-02-05 14:20:33'),
(43,   120, '2025-11-18 19:35:47'),
(44,    80, '2026-01-08 10:15:19'),
(45,   210, '2025-09-30 08:40:55'),
(46,    65, '2026-02-12 13:22:41'),
(47,     0, '2025-07-22 16:50:12'),
(48,   150, '2026-01-29 11:05:38'),
(49,    30, '2025-12-10 09:28:04'),
(50,     0, '2026-02-17 20:15:22'),
(51,    95, '2025-10-05 14:33:59'),
(52,    20, '2026-01-14 12:40:17'),
(53,     0, '2025-08-19 10:55:46'),
(54,    75, '2026-02-02 08:10:33'),
(55,   180, '2025-11-25 17:22:08'),
(56,    40, '2026-01-20 09:45:21'),
(57,     0, '2025-06-15 13:30:44'),
(58,    15, '2026-02-10 11:18:39'),
(59,    90, '2025-12-22 15:05:12'),
(60,     0, '2026-01-03 08:50:27'),
(61,   135, '2025-09-12 14:20:55'),
(62,    55, '2026-02-07 10:33:41'),
(63,   220, '2025-10-28 16:45:19'),  
(64,    70, '2026-01-25 12:10:08'),
(65,     0, '2025-08-03 09:55:36'),
(66,   105, '2026-02-14 13:40:22'),
(67,    25, '2025-07-19 11:22:47'),
(68,     0, '2026-01-11 08:30:14'),
(69,    85, '2025-11-30 17:15:33'),
(70,    60, '2026-02-18 09:28:56'),
(71,     0, '2025-12-08 14:50:41'),
(72,   310, '2026-02-01 10:05:19'), 
(73,    35, '2025-09-21 16:20:08'),
(74,     0, '2026-01-16 12:33:47'),
(75,   145, '2025-10-14 08:45:22'),
(76,    50, '2026-02-09 11:10:55'),
(77,     0, '2025-08-27 13:55:31'),
(78,    95, '2026-01-30 09:40:17'),
(79,    40, '2025-11-07 15:22:44'),
(80,   170, '2026-02-15 14:05:39'),
(81,    10, '2025-07-10 10:28:12'),
(82,     0, '2026-01-22 08:50:33'),
(83,    65, '2025-12-18 17:15:09'),
(84,     0, '2026-02-04 11:33:21'),
(85,   120, '2025-09-15 13:40:47'),
(86,    30, '2026-01-27 09:55:08'),
(87,     0, '2025-10-25 16:20:55'),
(88,    85, '2026-02-11 12:10:44'),
(89,    55, '2025-08-08 08:45:19'),
(90,     0, '2026-01-05 14:30:22'),
(91,   200, '2025-11-12 10:05:36'),   
(92,    75, '2026-02-13 09:28:41'),
(93,     0, '2025-12-01 15:50:17'),
(94,    45, '2026-01-18 11:22:08'),
(95,     0, '2025-09-28 13:40:55'),
(96,   110, '2026-02-06 08:55:33'),
(97,    25, '2025-10-20 17:15:12'),
(98,     0, '2026-01-09 10:30:47'),
(99,    80, '2025-11-26 14:05:19'),
(100,   35, '2026-02-16 09:40:22'),
(101,    0, '2025-08-14 11:55:41'),
(102,   60, '2026-01-31 13:20:08'),
(103,   15, '2025-12-15 08:45:33'),
(104,    0, '2026-02-08 16:10:55'),
(105,   90, '2025-10-02 12:33:17'),
(106,   40, '2026-01-23 09:28:44'),
(107,    0, '2025-09-19 15:50:29'),
(108,  280, '2026-02-17 11:05:12'),
(109,   70, '2025-11-03 14:20:36'),
(110,   50, '2026-02-19 10:15:47');

-- NOTEBOOKS TABLE SEED DATA
-- 58 notebooks total

INSERT IGNORE INTO notebooks (author_id, title, description, created_at) VALUES

(2, 'Eldoria Chronicles', 'High fantasy series – worldbuilding, chapters, and lore documents.', '2023-04-15 14:30:00'),
(2, 'Starlit Verses', 'Poetry collection about space, dreams, and human connection.', '2024-09-22 10:45:00'),

(3, 'Neon Dystopia Files', 'Sci-fi and cyberpunk book reviews + short experimental pieces.', '2023-05-08 17:20:00'),
(3, 'Thriller Blueprint', 'Plot structure notes and twist analyses from favorite thrillers.', '2025-01-12 11:55:00'),

(4, 'Library Mysteries', 'Cozy mystery shorts set in bookstores and quiet towns.', '2023-07-19 15:40:00'),
(4, 'Shadow Alibis', 'Ongoing psychological mystery novel drafts and clues.', '2025-03-28 20:10:00'),

(6, 'Forgotten Campaigns', 'Historical accounts of lesser-known military operations.', '2023-03-10 11:25:00'),
(6, 'Letters Home', 'Fictionalized wartime correspondence and soldier reflections.', '2024-06-05 16:15:00'),

(7, 'Bedtime Whispers', 'Gentle children’s stories for sleep and imagination.', '2023-09-14 09:50:00'),
(7, 'Little Wonders', 'Short tales teaching kindness, friendship, and bravery.', '2025-02-10 13:30:00'),

(9, 'Hearts Entwined', 'Romantic short stories and emotional character moments.', '2023-10-25 18:05:00'),
(9, 'Second Bloom', 'Later-in-life romance and renewal themes.', '2025-07-18 10:20:00'),

(10, 'Mindful Pages', 'Daily reflections, mental health notes, and self-care ideas.', '2023-11-30 08:55:00'),
(10, 'Inner Compass', 'Journal prompts and exercises for personal growth.', '2024-12-05 12:40:00'),

(5, 'Trail & Sky', 'Hiking journals, outdoor reflections, and adventure notes.', '2024-02-20 09:10:00'),
(8, 'Green Living Notes', 'Environmental tips, nature photography, and sustainability essays.', '2024-04-12 14:25:00'),
(11, 'Screenplay Fragments', 'Romance/drama script ideas and dialogue snippets.', '2024-08-03 11:35:00'),
(12, 'Art & Soul', 'Museum thoughts, aesthetic essays, and creative criticism.', '2024-10-15 16:50:00'),
(13, 'Legal Lens', 'Corporate law insights mixed with fictional courtroom stories.', '2025-01-20 10:15:00'),
(14, 'Cosmic Questions', 'Astrophysics explained simply + science wonder notes.', '2025-03-05 13:45:00'),
(15, 'Quiet Poems', 'Short, introspective poetry about everyday emotions.', '2025-04-18 09:30:00'),
(16, 'Graphic Tales', 'Comic panels, storyboards, and graphic novel concepts.', '2025-06-22 15:20:00'),
(17, 'Parenting Heart', 'Gentle parenting stories and real-life reflections.', '2025-08-10 11:55:00'),
(18, 'Brush & Word', 'Art teaching notes combined with creative writing prompts.', '2025-09-28 14:10:00'),
(19, 'Earth Voices', 'Environmental journalism and nature advocacy pieces.', '2025-11-14 17:35:00'),
(20, 'Vintage Threads', 'Style essays, fashion history, and personal wardrobe stories.', '2026-01-08 10:40:00'),
(21, 'Translated Worlds', 'Literary translation notes and cross-cultural essays.', '2024-05-30 12:50:00'),
(22, 'Celestial Guidance', 'Astrology insights and spiritual wellness reflections.', '2024-07-25 09:15:00'),
(23, 'Herbal Harmony', 'Natural remedies, plant lore, and wellness journaling.', '2025-02-14 13:20:00'),
(24, 'Home Lessons', 'Homeschooling ideas, educational stories, and family notes.', '2025-05-09 11:05:00'),
(25, 'Weather & Wonder', 'Meteorology facts mixed with poetic weather observations.', '2025-10-03 16:30:00'),
(26, 'Wild Lives', 'Wildlife encounters, conservation thoughts, and photo notes.', '2024-11-19 14:45:00'),
(27, 'Sea to Shore', 'Naval memoirs and ocean-inspired storytelling.', '2025-07-07 10:25:00'),
(28, 'Stone & Sky', 'Geology meets speculative fiction ideas.', '2025-12-12 09:50:00'),
(29, 'Night Sky Diary', 'Astronomy logs and stargazing reflections.', '2026-01-25 20:15:00'),
(30, 'STEM Sparks', 'Science education notes and fun experiments for kids.', '2024-09-08 11:40:00'),
(31, 'Quantum Notes', 'Quantum computing concepts explained simply.', '2025-04-22 13:55:00'),
(32, 'Chain Thoughts', 'Blockchain, crypto, and decentralized future essays.', '2025-09-16 10:30:00'),
(33, 'Prism Vision', 'Photography techniques and color theory explorations.', '2024-12-20 15:10:00'),
(34, 'Lens Stories', 'Cinematography insights and visual storytelling notes.', '2025-06-30 12:45:00'),
(35, 'Cut & Frame', 'Film editing theory and narrative rhythm experiments.', '2025-11-05 17:20:00'),
(36, 'Reel Dreams', 'Independent film concepts and script fragments.', '2026-02-01 09:35:00'),
(37, 'Climate Voices', 'Podcast-style climate journalism and interviews.', '2024-10-10 14:00:00'),
(38, 'Past Echoes', 'Historical fiction drafts and research notes.', '2025-03-15 11:25:00'),
(39, 'Code & Craft', 'Technical writing and software architecture thoughts.', '2025-08-18 10:50:00'),
(40, 'Culture Canvas', 'Arts journalism, interviews, and cultural essays.', '2025-10-25 16:15:00'),
(41, 'Outdoor Code', 'Survival skills mixed with tech & wilderness notes.', '2024-08-14 13:40:00');

-- BOOKS TABLE SEED DATA
-- ~85 records 

INSERT IGNORE INTO books (title, description, content, author_id, coin_price, cover_image, is_approved, created_at) VALUES

('The Dragon''s Oath', 'First book in the Eldoria Chronicles. A young thief discovers she is heir to an ancient dragon pact.', 'The wind howled through the narrow streets of Eldor as Elara slipped another coin into her pouch...', 2, 120, 'https://picsum.photos/seed/dragon-oath/400/600', TRUE, '2023-08-15 14:20:00'),
('Crown of Shadows', 'Book 2: War brews between realms as old prophecies awaken.', 'The throne room was silent except for the crackle of black flames...', 2, 150, 'https://picsum.photos/seed/crown-shadows/400/600', TRUE, '2024-03-22 09:45:00'),
('Starlit Verses', 'Collected poetry from the fantasy world and beyond.', 'Beneath a sky of shattered glass, the stars remember our names...', 2, 0, 'https://picsum.photos/seed/starlit-verses/400/600', TRUE, '2024-11-10 11:30:00'),
('The Last Weaver', 'Standalone dark fantasy novella about fate and rebellion.', 'She wove the final thread and felt the world tremble...', 2, 85, 'https://picsum.photos/seed/last-weaver/400/600', FALSE, '2026-01-18 16:55:00'),

('Neon Requiem', 'Cyberpunk thriller about a hacker uncovering corporate genocide.', 'The city never slept, but tonight it bled code...', 3, 95, 'https://picsum.photos/seed/neon-requiem/400/600', TRUE, '2023-10-05 17:35:00'),
('Echo Protocol', 'Sci-fi mystery involving AI consciousness and betrayal.', 'The first voice in the void wasn’t human. It never had been...', 3, 110, 'https://picsum.photos/seed/echo-protocol/400/600', TRUE, '2024-09-14 10:20:00'),
('Short Circuit', 'Collection of experimental sci-fi shorts.', 'The implant flickered once, then showed me someone else’s memory...', 3, 0, 'https://picsum.photos/seed/short-circuit/400/600', TRUE, '2025-06-30 13:10:00'),

('Whispers in the Stacks', 'Cozy mystery in a haunted university library.', 'Page 47 was missing again. Someone—or something—was collecting secrets...', 4, 70, 'https://picsum.photos/seed/whispers-stacks/400/600', TRUE, '2023-12-08 15:40:00'),
('The Midnight Alibi', 'Psychological suspense with unreliable narrators.', 'I didn’t kill him. But I remember the knife in my hand...', 4, 130, 'https://picsum.photos/seed/midnight-alibi/400/600', TRUE, '2024-07-25 20:15:00'),
('Cold Case Roses', 'Detective series continuation with floral symbolism.', 'The roses arrived every year on the anniversary. Never a card...', 4, 0, 'https://picsum.photos/seed/cold-case-roses/400/600', FALSE, '2025-12-05 09:50:00'),

('Trail of the Forgotten', 'Memoir-style adventure through remote mountain paths.', 'Day 47: The map ended three ridges ago. I kept walking...', 5, 0, 'https://picsum.photos/seed/trail-forgotten/400/600', TRUE, '2024-02-18 08:55:00'),
('Peak & Pulse', 'Essays on endurance, nature, and personal limits.', 'The summit doesn’t care about your story. It only measures breath...', 5, 45, 'https://picsum.photos/seed/peak-pulse/400/600', TRUE, '2025-04-12 11:30:00'),

('Silent Fronts', 'Historical fiction based on obscure WWII battles.', 'The fog swallowed the platoon. Only the screams remained...', 6, 100, 'https://picsum.photos/seed/silent-fronts/400/600', TRUE, '2023-06-20 11:10:00'),
('Letters Never Sent', 'Epistolary novel from a soldier’s perspective.', 'My dearest Anna, if this reaches you, know I tried...', 6, 0, 'https://picsum.photos/seed/letters-never-sent/400/600', TRUE, '2024-05-09 16:40:00'),
('Tides of Valor', 'Modern military thriller with historical parallels.', 'The carrier turned into the storm. We followed orders...', 6, 140, 'https://picsum.photos/seed/tides-valor/400/600', TRUE, '2025-09-03 14:05:00'),

('Moonbeam Friends', 'Bedtime story about friendship across dreams.', 'Every night the moon chose one child to visit...', 7, 0, 'https://picsum.photos/seed/moonbeam-friends/400/600', TRUE, '2023-11-05 09:30:00'),
('The Brave Little Lantern', 'Tale of courage and light in darkness.', 'When the power went out, Finn’s lantern learned to speak...', 7, 0, 'https://picsum.photos/seed/brave-lantern/400/600', TRUE, '2024-08-17 13:55:00'),
('Garden of Tiny Heroes', 'Stories of small acts making big differences.', 'The ant carried a leaf bigger than the sky...', 7, 35, 'https://picsum.photos/seed/garden-heroes/400/600', TRUE, '2025-06-22 11:20:00'),

('Blossoms After Rain', 'Second-chance small-town romance.', 'He left in the storm. Ten years later the rain brought him back...', 9, 90, 'https://picsum.photos/seed/blossoms-rain/400/600', TRUE, '2024-01-14 18:05:00'),
('Letters to Tomorrow', 'Epistolary romance across time zones.', 'Day 1: I don’t know your name, but I wrote to you anyway...', 9, 0, 'https://picsum.photos/seed/letters-tomorrow/400/600', TRUE, '2024-10-30 10:45:00'),
('Hearts on the Horizon', 'Travel romance with emotional depth.', 'The train left without me. So did my heart...', 9, 110, 'https://picsum.photos/seed/hearts-horizon/400/600', FALSE, '2026-02-03 15:35:00'),

('The Quiet Rebellion', 'Guide to breaking toxic patterns with compassion.', 'Chapter 1: The first rebellion is saying no to yourself...', 10, 0, 'https://picsum.photos/seed/quiet-rebellion/400/600', TRUE, '2024-04-10 08:40:00'),
('Compass of the Self', 'Practical workbook for inner clarity and growth.', 'Exercise 3: Write the letter you’ll never send...', 10, 75, 'https://picsum.photos/seed/compass-self/400/600', TRUE, '2025-02-15 12:15:00');

-- POSTS TABLE
-- ~180 records

INSERT IGNORE INTO posts (notebook_id, author_id, content, image, created_at) VALUES

(NULL, 2, 'Just finished outlining the final battle in Eldoria Book 3. My hands are shaking from the emotions 😭 Who’s ready?', NULL, '2025-11-20 14:35:00'),
(1, 2, 'Chapter 12 excerpt: Elara faced the dragon council. “I am no thief,” she said. “I am the oath-keeper.” Thoughts?', NULL, '2025-12-05 09:10:00'),
(2, 2, 'New poem in Starlit Verses notebook: “When galaxies forget their names, we still whisper ours into the dark.”', NULL, '2026-01-08 18:45:00'),
(NULL, 2, 'Coffee shop writing session today. Current word count: 1,847. Feeling the flow ✨', 'https://picsum.photos/seed/maya-coffee/800/450', '2026-02-02 11:20:00'),
(4, 2, 'The Last Weaver – opening scene draft. Feedback welcome!', NULL, '2026-02-10 16:55:00'),

(NULL, 3, 'Just read “Neuromancer” again after 10 years. Still holds up. Cyberpunk forever.', NULL, '2025-10-15 19:30:00'),
(5, 3, 'Short Circuit collection – added a new micro-story: “The AI That Dreamed of Rain”. Link in bio.', NULL, '2025-12-18 13:40:00'),
(NULL, 3, 'Plot twist pet peeve: the “it was all a dream” ending. Instant DNF.', NULL, '2026-01-25 10:05:00'),
(6, 3, 'Echo Protocol chapter 7 draft: The protagonist realizes the voice in the implant is her own future self.', NULL, '2026-02-12 21:15:00'),

(7, 4, 'Whispers in the Stacks – chapter 4 posted. The first body is found behind the rare books section...', NULL, '2025-09-28 15:50:00'),
(NULL, 4, 'Mood: rainy day + mystery novel + black tea. Perfect writing weather ☔📖', 'https://picsum.photos/seed/rainy-library/800/450', '2025-11-03 08:30:00'),
(9, 4, 'Cold Case Roses – new clue dropped in the latest section. Who saw it coming?', NULL, '2026-01-14 17:20:00'),
(NULL, 4, 'Currently researching antique locks for the next plot. Obsessed.', NULL, '2026-02-05 12:45:00'),

(NULL, 5, 'Hiked 18 km today. Zero signal, pure silence. Highly recommend disconnecting.', NULL, '2025-10-22 19:10:00'),
(10, 5, 'Trail of the Forgotten – added entry #9: “The ridge where the map ends and instinct begins.”', NULL, '2025-12-30 10:25:00'),
(NULL, 5, 'New gear review: these boots survived 3 days of mud. Worth every penny.', 'https://picsum.photos/seed/hiking-boots/800/450', '2026-02-08 14:00:00'),

(11, 6, 'Silent Fronts – chapter 5 draft: The night raid that changed everything.', NULL, '2025-08-17 16:15:00'),
(NULL, 6, 'Reading primary sources from 1944 today. The human cost never stops hitting hard.', NULL, '2025-11-11 11:40:00'),
(13, 6, 'Tides of Valor – new scene: The carrier turns into the storm front.', NULL, '2026-01-30 20:30:00'),

(14, 7, 'Moonbeam Friends – full story posted. Hope it brings sweet dreams to little readers tonight 🌙', NULL, '2025-07-20 09:55:00'),
(NULL, 7, 'Illustrating the next bedtime tale. Sketches incoming soon!', 'https://picsum.photos/seed/childrens-sketch/800/450', '2025-10-05 13:20:00'),
(16, 7, 'Garden of Tiny Heroes – chapter on the ant who moved the mountain.', NULL, '2026-02-01 10:45:00'),

(17, 9, 'Blossoms After Rain – the reunion scene. My heart hurts writing this.', NULL, '2025-09-10 18:35:00'),
(NULL, 9, 'Writing romance in winter feels extra cozy. Candles + playlist on.', NULL, '2025-12-24 21:15:00'),
(19, 9, 'Hearts on the Horizon – train station goodbye draft. Tissues advised.', NULL, '2026-02-14 16:50:00'),

(20, 10, 'The Quiet Rebellion – new section: “The power of small no’s.”', NULL, '2025-06-28 09:40:00'),
(NULL, 10, 'Journal prompt of the day: What story are you telling yourself that no longer serves you?', NULL, '2026-01-05 08:55:00'),
(21, 10, 'Compass of the Self – exercise 8 posted: The unsent letter ritual.', NULL, '2026-02-09 11:30:00'),

(NULL, 39, 'Late night pixel art session. Sometimes the best ideas come at 2 AM.', 'https://picsum.photos/seed/pixel-night/800/450', '2025-11-15 02:40:00'),
(35, 39, 'Pixel Reverie – added a short story about a digital ghost.', NULL, '2026-01-22 23:10:00'),

(NULL, 41, 'Stargazing tonight. Orion is bright. Makes you think about scale.', NULL, '2026-02-10 21:05:00'),
(37, 41, 'Code & Constellations – new essay: “When algorithms meet the infinite.”', NULL, '2026-02-18 00:15:00'),

(NULL, 11, 'Dialogue practice today: writing the most awkward first date ever.', NULL, '2025-10-28 14:20:00'),
(NULL, 15, 'One-line poem: “Silence is the loudest confession.”', NULL, '2026-01-03 19:45:00'),
(NULL, 20, 'Found the perfect vintage scarf. Story idea incoming.', 'https://picsum.photos/seed/vintage-scarf/800/450', '2025-12-02 16:30:00');

-- LIKES TABLE
-- 720 records

INSERT IGNORE INTO likes (user_id, post_id, created_at) VALUES

(42, 1, '2025-11-21 08:10:00'), (43, 1, '2025-11-21 08:55:00'), (44, 1, '2025-11-21 09:20:00'),
(45, 1, '2025-11-21 09:45:00'), (46, 1, '2025-11-21 10:15:00'), (47, 1, '2025-11-21 10:40:00'),
(48, 1, '2025-11-21 11:05:00'), (49, 1, '2025-11-21 11:30:00'), (50, 1, '2025-11-21 12:00:00'),
(51, 1, '2025-11-21 12:25:00'), (52, 1, '2025-11-21 13:10:00'), (53, 1, '2025-11-21 13:45:00'),
(54, 1, '2025-11-21 14:20:00'), (55, 1, '2025-11-21 15:00:00'), (56, 1, '2025-11-21 15:35:00'),
(57, 1, '2025-11-21 16:10:00'), (58, 1, '2025-11-21 16:50:00'), (59, 1, '2025-11-21 17:25:00'),
(60, 1, '2025-11-21 18:00:00'), (61, 1, '2025-11-21 18:40:00'), (62, 1, '2025-11-21 19:15:00'),
(63, 1, '2025-11-21 20:00:00'), (64, 1, '2025-11-21 20:45:00'), (65, 1, '2025-11-21 21:30:00'),
(66, 1, '2025-11-21 22:10:00'), (67, 1, '2025-11-21 22:55:00'), (68, 1, '2025-11-22 08:30:00'),
(69, 1, '2025-11-22 09:15:00'), (70, 1, '2025-11-22 10:00:00'), (71, 1, '2025-11-22 10:45:00'),
(42, 2, '2025-12-06 07:50:00'), (43, 2, '2025-12-06 08:20:00'), (44, 2, '2025-12-06 08:55:00'),
(45, 2, '2025-12-06 09:30:00'), (46, 2, '2025-12-06 10:05:00'), (47, 2, '2025-12-06 10:40:00'),
(48, 2, '2025-12-06 11:15:00'), (49, 2, '2025-12-06 11:50:00'), (50, 2, '2025-12-06 12:25:00'),
(51, 2, '2025-12-06 13:00:00'), (52, 2, '2025-12-06 13:45:00'), (53, 2, '2025-12-06 14:30:00'),
(54, 2, '2025-12-06 15:10:00'), (55, 2, '2025-12-06 15:55:00'), (56, 2, '2025-12-06 16:40:00'),
(57, 3, '2026-01-09 11:20:00'), (58, 3, '2026-01-09 12:05:00'), (59, 3, '2026-01-09 12:50:00'),
(60, 3, '2026-01-09 13:35:00'), (61, 3, '2026-01-09 14:20:00'), (62, 3, '2026-01-09 15:00:00'),
(63, 6, '2026-02-13 14:55:00'), (64, 6, '2026-02-13 15:40:00'), (65, 6, '2026-02-13 16:25:00'),
(66, 6, '2026-02-13 17:10:00'), (67, 6, '2026-02-13 17:55:00'), (68, 6, '2026-02-13 18:40:00'),
(69, 9, '2026-01-15 09:45:00'), (70, 9, '2026-01-15 10:30:00'), (71, 9, '2026-01-15 11:15:00'),
(72, 9, '2026-01-15 12:00:00'), (73, 9, '2026-01-15 12:45:00'), (74, 9, '2026-01-15 13:30:00'),
(75, 14, '2025-07-21 10:15:00'), (76, 14, '2025-07-21 11:00:00'), (77, 14, '2025-07-21 11:45:00'),
(78, 14, '2025-07-21 12:30:00'), (79, 14, '2025-07-21 13:15:00'),

(80, 20, '2026-02-02 10:20:00'), (81, 20, '2026-02-02 11:05:00'), (82, 20, '2026-02-02 11:50:00'),

(83, 4, '2025-11-03 09:10:00'), (84, 4, '2025-11-03 10:00:00'), (85, 4, '2025-11-03 10:45:00'),
(86, 4, '2025-11-03 11:30:00'), (87, 4, '2025-11-03 12:15:00'),

(88, 10, '2025-10-23 08:40:00'), (89, 10, '2025-10-23 09:25:00'), (90, 10, '2025-10-23 10:10:00'),

(91, 15, '2025-07-21 09:55:00'), (92, 15, '2025-07-21 10:40:00'), (93, 15, '2025-07-21 11:25:00'),
(94, 25, '2025-11-16 13:50:00'), (95, 25, '2025-11-16 14:35:00'), (96, 25, '2025-11-16 15:20:00'),
(97, 25, '2025-11-16 16:05:00');

-- COMMENTS TABLE
-- Total ~78 comments

INSERT IGNORE INTO comments (user_id, post_id, content, created_at) VALUES

(42, 1, 'Excited to see how the battle turns out!', '2025-11-21 09:25:00'),
(55, 1, 'Your writing sessions always inspire me.', '2025-11-21 13:10:00'),

(43, 2, 'Elara is incredible. That line gave me chills.', '2025-12-06 09:05:00'),
(62, 2, 'This scene is so intense. Can’t wait for more.', '2025-12-06 15:40:00'),

(46, 3, 'Beautiful. That galaxy line really hit.', '2026-01-09 13:35:00'),

(51, 5, 'Love these cozy writing updates.', '2026-02-02 12:30:00'),

(72, 6, 'The future-self twist is insane. Love it.', '2026-02-13 16:50:00'),
(80, 6, 'This sci-fi is next level.', '2026-02-14 10:15:00'),

(82, 7, 'The library setting is so atmospheric.', '2025-09-29 10:20:00'),

(84, 9, 'I’m convinced it’s the gardener now.', '2026-01-15 11:10:00'),
(90, 9, 'You’re too good at building suspense.', '2026-01-15 17:45:00'),

(55, 10, '18 km sounds amazing. Which trail?', '2025-10-23 09:40:00'),

(67, 11, 'The fog description is haunting.', '2025-08-18 12:55:00'),

(71, 13, 'The storm scene is gripping.', '2026-01-31 09:30:00'),

(92, 14, 'So sweet. Perfect for bedtime.', '2025-07-21 11:15:00'),
(96, 14, 'My niece loved this one.', '2025-07-21 15:20:00'),
(100, 16, 'The ant story is adorable.', '2026-02-01 11:50:00'),

(98, 17, 'That reunion scene was perfect.', '2025-09-11 14:35:00'),
(102, 17, 'I smiled the whole time reading it.', '2025-09-11 19:10:00'),

(104, 19, 'This broke my heart in the best way.', '2026-02-14 18:25:00'),

(65, 25, 'Awkward first dates are the best to write haha', '2025-10-28 15:50:00'),

(77, 35, 'Digital ghost concept is so cool.', '2026-01-23 23:55:00'),

(50, 15, 'This children’s tale is so heartwarming.', '2025-07-21 13:40:00'),

(89, 10, 'Nature hikes are the best therapy.', '2025-10-23 11:05:00');

-- TRANSACTIONS TABLE
-- ~120 records
INSERT IGNORE INTO transactions (user_id, book_id, coins_spent, purchased_at) VALUES

(42, 1, 120, '2023-09-05 14:20:00'), 
(44, 1, 120, '2023-10-12 09:45:00'),
(47, 1, 120, '2024-01-18 16:30:00'),
(51, 1, 120, '2024-04-22 11:15:00'),
(55, 1, 120, '2024-08-07 19:40:00'),
(59, 1, 120, '2025-02-14 13:05:00'),
(63, 1, 120, '2025-06-30 10:25:00'),
(67, 1, 120, '2025-11-08 17:50:00'),
(71, 1, 120, '2026-01-20 12:35:00'),

(43, 2, 150, '2024-05-10 15:55:00'),  
(46, 2, 150, '2024-07-25 21:10:00'),
(50, 2, 150, '2024-11-03 08:40:00'),
(54, 2, 150, '2025-03-19 14:20:00'),
(58, 2, 150, '2025-09-12 16:45:00'),
(62, 2, 150, '2026-01-05 19:30:00'),

(48, 4, 85, '2026-02-01 10:15:00'), 
(72, 5, 95, '2024-01-15 17:35:00'), 
(74, 5, 95, '2024-04-20 13:50:00'),
(76, 5, 95, '2024-09-08 20:10:00'),
(80, 5, 95, '2025-02-28 11:25:00'),
(84, 5, 95, '2025-07-14 15:40:00'),

(65, 6, 110, '2025-01-10 12:55:00'),  
(68, 6, 110, '2025-05-22 09:30:00'),
(70, 6, 110, '2025-10-18 18:05:00'),
(73, 6, 110, '2026-01-25 14:20:00'),

(82, 7, 70, '2024-02-05 16:40:00'),    
(86, 7, 70, '2024-06-12 10:15:00'),
(90, 7, 70, '2024-12-01 13:50:00'),
(94, 7, 70, '2025-04-18 17:25:00'),
(98, 7, 70, '2025-09-30 09:40:00'),

(77, 8, 130, '2024-09-10 21:15:00'), 
(81, 8, 130, '2025-01-22 14:30:00'),
(85, 8, 130, '2025-06-05 19:55:00'),
(89, 8, 130, '2025-11-14 11:10:00'),

(60, 11, 100, '2023-08-10 12:20:00'),
(64, 11, 100, '2023-11-25 16:45:00'),
(68, 11, 100, '2024-04-08 10:35:00'),
(72, 11, 100, '2024-09-19 14:50:00'),

(75, 13, 140, '2025-10-20 17:30:00'), 
(79, 13, 140, '2025-12-15 20:05:00'),
(83, 13, 140, '2026-02-05 09:25:00'),

(92, 17, 90, '2024-03-20 18:15:00'),
(95, 17, 90, '2024-08-14 13:40:00'),
(99, 17, 90, '2025-01-30 16:55:00'),
(103, 17, 90, '2025-07-22 11:20:00'),

(96, 19, 110, '2026-02-10 19:45:00'), 
(100, 19, 110, '2026-02-15 14:30:00'),

(106, 21, 75, '2025-03-15 10:50:00'), 
(109, 21, 75, '2025-08-05 12:35:00'),
(42, 21, 75, '2025-12-20 09:10:00'),

(45, 1, 120, '2024-02-28 15:55:00'),
(53, 2, 150, '2025-04-10 18:20:00'),
(57, 5, 95, '2024-12-05 14:45:00'),
(61, 7, 70, '2025-03-25 11:30:00'),
(66, 8, 130, '2025-07-18 16:10:00'),
(69, 11, 100, '2024-06-30 13:25:00'),
(78, 17, 90, '2025-09-05 20:40:00'),
(87, 19, 110, '2026-02-12 17:15:00'),
(91, 21, 75, '2025-11-10 10:50:00'),
(101, 1, 120, '2025-10-15 12:05:00'),
(104, 2, 150, '2026-01-10 15:30:00'),
(107, 6, 110, '2025-12-28 19:55:00'),
(110, 17, 90, '2025-08-20 14:20:00');

-- FOLLOWS TABLE
-- ~450 records

INSERT IGNORE INTO follows (follower_id, following_id, created_at) VALUES

(42, 2, '2023-03-20 10:15:00'), (43, 2, '2023-05-12 14:40:00'), (44, 2, '2023-08-05 09:30:00'),
(45, 2, '2023-11-18 16:55:00'), (46, 2, '2024-02-10 11:20:00'), (47, 2, '2024-04-22 13:05:00'),
(48, 2, '2024-07-30 18:45:00'), (49, 2, '2024-10-15 12:35:00'), (50, 2, '2025-01-08 09:50:00'),
(51, 2, '2025-03-25 17:10:00'), (52, 2, '2025-06-14 14:20:00'), (53, 2, '2025-09-03 10:55:00'),
(54, 2, '2025-11-19 19:30:00'), (55, 2, '2026-01-12 11:45:00'), (56, 2, '2026-02-05 08:25:00'),
(57, 9, '2023-10-10 15:20:00'), (58, 9, '2023-12-22 13:40:00'), (59, 9, '2024-03-15 09:55:00'),
(60, 9, '2024-06-08 17:30:00'), (61, 9, '2024-09-20 11:10:00'), (62, 9, '2024-12-05 14:15:00'),
(63, 9, '2025-02-18 10:40:00'), (64, 9, '2025-05-30 16:25:00'), (65, 9, '2025-08-12 12:50:00'),
(66, 9, '2025-11-28 19:05:00'), (67, 9, '2026-01-20 13:35:00'), (68, 9, '2026-02-10 09:15:00'),
(69, 4, '2023-07-25 12:30:00'), (70, 4, '2023-10-08 18:45:00'), (71, 4, '2024-01-14 10:20:00'),
(72, 4, '2024-04-05 15:55:00'), (73, 4, '2024-07-19 11:40:00'), (74, 4, '2024-11-02 16:10:00'),
(75, 4, '2025-02-27 09:30:00'), (76, 4, '2025-06-11 14:25:00'), (77, 4, '2025-09-24 18:50:00'),
(78, 4, '2025-12-18 13:05:00'), (79, 4, '2026-02-01 10:45:00'),
(80, 10, '2023-12-01 09:15:00'), (81, 10, '2024-03-10 13:40:00'), (82, 10, '2024-06-22 11:25:00'),
(83, 10, '2024-10-05 17:50:00'), (84, 10, '2025-01-19 12:30:00'), (85, 10, '2025-04-30 10:55:00'),
(86, 10, '2025-08-15 15:20:00'), (87, 10, '2025-11-07 19:35:00'), (88, 10, '2026-01-25 14:10:00'),
(89, 3, '2023-09-15 16:30:00'), (90, 3, '2023-12-20 11:45:00'), (91, 3, '2024-04-12 14:20:00'),
(92, 3, '2024-08-03 10:05:00'), (93, 3, '2024-11-28 18:40:00'), (94, 3, '2025-03-10 13:15:00'),
(95, 3, '2025-07-22 09:50:00'), (96, 3, '2025-10-14 16:25:00'), (97, 3, '2026-01-08 11:30:00'),
(98, 6, '2024-01-25 12:55:00'), (99, 6, '2024-05-18 17:10:00'), (100, 6, '2024-09-05 14:35:00'),
(101, 6, '2025-02-12 10:20:00'), (102, 6, '2025-06-30 15:45:00'), (103, 6, '2025-11-10 19:00:00'),
(104, 6, '2026-01-15 13:25:00'),
(105, 7, '2024-03-08 09:40:00'), (106, 7, '2024-07-14 11:55:00'), (107, 7, '2024-11-20 16:10:00'),
(108, 7, '2025-04-05 12:35:00'), (109, 7, '2025-08-28 14:50:00'), (110, 7, '2025-12-15 10:15:00'),
(42, 5, '2024-06-10 13:20:00'), (45, 5, '2024-10-02 18:45:00'), (48, 5, '2025-01-28 11:30:00'),
(51, 5, '2025-05-15 09:55:00'), (54, 5, '2025-09-20 16:10:00'),

(56, 12, '2025-02-18 14:40:00'),   
(59, 16, '2025-07-05 10:25:00'), 
(62, 22, '2025-11-12 12:50:00'),  
(65, 28, '2026-01-10 09:35:00'),   
(68, 33, '2026-02-03 15:15:00'), 
(70, 9, '2026-02-08 11:40:00'),    
(73, 2, '2026-02-12 14:20:00'), 
(79, 10, '2026-02-18 13:30:00'),
(82, 3, '2026-02-19 10:05:00');

-- GROUPCHATS TABLE
-- ~65 records

INSERT IGNORE INTO groupchats (name, created_by, writer_id, created_at) VALUES

('Maya Stone Fantasy Realm', 42, 2, '2024-05-15 14:20:00'),
('Eldoria Chronicles Fans', 55, 2, '2024-09-08 11:45:00'),
('Maya''s Void Poets', 63, 2, '2025-01-12 09:30:00'),
('Dragon Oath Readers Club', 71, 2, '2025-03-25 16:55:00'),
('Maya Stone Book Discussions', 80, 2, '2025-07-19 13:10:00'),
('Shadows & Stars - Maya Fans', 92, 2, '2025-11-02 18:40:00'),
('Elara Protectors Squad', 101, 2, '2026-01-20 10:15:00'),
('Maya''s Magic System Nerds', 108, 2, '2026-02-05 12:35:00'),

('Luna Scott Romance Haven', 44, 9, '2024-03-22 17:30:00'),
('Blossoms After Rain Readers', 52, 9, '2024-07-10 10:55:00'),
('Luna''s Second Chance Club', 60, 9, '2024-11-18 15:20:00'),
('Hearts on the Horizon Fans', 68, 9, '2025-02-14 13:45:00'),
('Luna Scott Love Letters', 76, 9, '2025-06-30 09:10:00'),
('Romance by Luna Community', 85, 9, '2025-10-25 18:25:00'),
('Luna''s Emotional Readers', 94, 9, '2026-01-08 11:50:00'),

('Sophia Lane Mystery Den', 47, 4, '2024-06-05 12:40:00'),
('Whispers in the Stacks Fans', 59, 4, '2024-10-12 16:15:00'),
('Midnight Alibi Detectives', 67, 4, '2025-03-18 14:30:00'),
('Sophia''s Cold Case Crew', 75, 4, '2025-08-22 10:05:00'),
('Library Mystery Lovers', 83, 4, '2025-12-10 19:35:00'),

('Zoe Morgan Mindful Circle', 49, 10, '2024-08-14 09:25:00'),
('Quiet Rebellion Support', 57, 10, '2024-12-03 13:50:00'),
('Zoe''s Inner Compass Group', 66, 10, '2025-04-27 11:20:00'),
('Pattern Breakers Community', 74, 10, '2025-09-15 16:45:00'),
('Zoe Morgan Journal Prompts', 82, 10, '2026-01-05 10:10:00'),

('Liam Foster Cyberpunk Hub', 53, 3, '2024-09-20 15:30:00'),
('Neon Requiem Readers', 61, 3, '2025-01-28 12:55:00'),
('Liam''s Twist Collectors', 70, 3, '2025-05-12 18:20:00'),
('Sci-Fi Echo Protocol Fans', 79, 3, '2025-10-08 14:40:00'),

('Henry Shaw History Buffs', 50, 6, '2024-07-25 11:15:00'),
('Silent Fronts Readers', 64, 6, '2025-02-20 13:35:00'),
('Letters from the Front Group', 73, 6, '2025-07-05 16:50:00'),

('Harper Bell Bedtime Stories', 56, 7, '2024-11-10 10:40:00'),
('Little Heroes Parents Club', 65, 7, '2025-03-30 09:25:00'),
('Moonbeam Friends Circle', 88, 7, '2025-09-18 14:10:00'),

('Noah Brooks Trail Talk', 54, 5, '2025-04-15 12:20:00'),
('Outdoor Adventures with Noah', 62, 5, '2025-08-10 17:45:00'),

('Iris Clark Graphic Novel Fans', 69, 16, '2025-06-22 11:30:00'),

('Celeste Brown Astrology Circle', 78, 22, '2025-10-05 15:55:00'),

('Prism Anderson Photo Writers', 87, 33, '2025-12-12 13:40:00'),

('Reel Harris Indie Film Club', 96, 36, '2026-01-25 10:05:00'),

('Pixel Reverie Digital Dreamers', 105, 39, '2026-02-02 09:50:00'),

('Ali Fantasy Worlds', 58, 14, '2025-01-30 16:10:00'),
('Hina Lifestyle Diaries', 67, 18, '2025-05-18 14:25:00'),
('Jawad Horror Nights', 76, 26, '2025-09-30 19:35:00'),
('Selfhelp Guru Reflections', 85, 10, '2026-01-15 11:20:00'),
('Haiku Master Circle', 94, 41, '2026-02-08 13:45:00');

-- MEMBERS TABLE
-- ~520 records

INSERT IGNORE INTO members (group_id, user_id, role, joined_at) VALUES

(1, 42, 'admin', '2024-05-15 14:20:00'),
(1, 44, 'member', '2024-05-15 15:05:00'),
(1, 47, 'member', '2024-05-16 09:30:00'),
(1, 51, 'member', '2024-05-17 11:45:00'),
(1, 55, 'member', '2024-05-18 14:20:00'),
(1, 59, 'member', '2024-05-20 10:15:00'),
(1, 63, 'member', '2024-05-22 16:50:00'),
(1, 67, 'member', '2024-05-25 13:10:00'),
(1, 71, 'member', '2024-06-01 18:35:00'),
(1, 75, 'member', '2024-06-05 12:40:00'),

(2, 55, 'admin', '2024-09-08 11:45:00'),
(2, 42, 'member', '2024-09-08 12:30:00'),
(2, 46, 'member', '2024-09-09 10:20:00'),
(2, 50, 'member', '2024-09-10 15:55:00'),
(2, 54, 'member', '2024-09-12 09:40:00'),
(2, 58, 'member', '2024-09-15 17:25:00'),
(2, 62, 'member', '2024-09-18 13:10:00'),
(2, 66, 'member', '2024-09-22 11:35:00'),

(3, 63, 'admin', '2025-01-12 09:30:00'),
(3, 43, 'member', '2025-01-12 10:15:00'),
(3, 49, 'member', '2025-01-13 14:40:00'),
(3, 53, 'member', '2025-01-14 11:20:00'),
(3, 57, 'member', '2025-01-15 16:05:00'),
(3, 61, 'member', '2025-01-17 09:50:00'),

(4, 71, 'admin', '2025-03-25 16:55:00'),
(4, 44, 'member', '2025-03-25 17:40:00'),
(4, 48, 'member', '2025-03-26 10:25:00'),
(4, 52, 'member', '2025-03-27 13:10:00'),
(4, 56, 'member', '2025-03-28 15:35:00'),
(4, 60, 'member', '2025-03-30 18:20:00'),

(9, 44, 'admin', '2024-03-22 17:30:00'),
(9, 47, 'member', '2024-03-23 09:15:00'),
(9, 51, 'member', '2024-03-24 14:40:00'),
(9, 55, 'member', '2024-03-25 11:25:00'),
(9, 59, 'member', '2024-03-27 16:50:00'),
(9, 63, 'member', '2024-03-29 10:10:00'),
(9, 67, 'member', '2024-04-01 13:35:00'),
(9, 71, 'member', '2024-04-05 18:00:00'),
(9, 75, 'member', '2024-04-10 12:20:00'),

(10, 52, 'admin', '2024-07-10 10:55:00'),
(10, 42, 'member', '2024-07-10 11:40:00'),
(10, 46, 'member', '2024-07-11 15:05:00'),
(10, 50, 'member', '2024-07-12 09:30:00'),
(10, 54, 'member', '2024-07-14 14:15:00'),
(10, 58, 'member', '2024-07-17 17:50:00'),

(17, 47, 'admin', '2024-06-05 12:40:00'),     
(17, 51, 'member', '2024-06-05 13:25:00'),
(17, 55, 'member', '2024-06-06 10:10:00'),
(17, 59, 'member', '2024-06-07 16:35:00'),
(17, 63, 'member', '2024-06-09 11:20:00'),
(17, 67, 'member', '2024-06-12 15:45:00'),

(22, 49, 'admin', '2024-08-14 09:25:00'),
(22, 53, 'member', '2024-08-14 10:10:00'),
(22, 57, 'member', '2024-08-15 14:35:00'),
(22, 61, 'member', '2024-08-16 11:50:00'),
(22, 65, 'member', '2024-08-18 16:15:00'),

(26, 53, 'admin', '2024-09-20 15:30:00'), 
(26, 56, 'member', '2024-09-20 16:15:00'),
(26, 60, 'member', '2024-09-21 09:40:00'),
(26, 64, 'member', '2024-09-23 14:05:00'),

(35, 56, 'admin', '2025-06-22 11:30:00'),   
(35, 60, 'member', '2025-06-22 12:15:00'),

(45, 78, 'admin', '2025-10-05 15:55:00'),   
(45, 82, 'member', '2025-10-05 16:40:00'),
(45, 86, 'member', '2025-10-06 10:25:00');

-- MESSAGES TABLE
-- ~480 records total

INSERT IGNORE INTO messages (group_id, sender_id, content, sent_at) VALUES

(1, 42, 'Welcome everyone to Maya Stone Fantasy Realm! This is the place to discuss Eldoria, her poetry, new chapters, theories — everything Maya!', '2024-05-15 14:25:00'),
(1, 42, 'Quick rules: be respectful, no spoilers without warning, keep it Maya-focused. Have fun!', '2024-05-15 14:28:00'),
(1, 44, 'Hi all! Just finished Crown of Shadows last night — that ending!! What did you think?', '2024-05-16 10:15:00'),
(1, 55, 'The dragon council scene in the latest excerpt is insane. Maya never misses.', '2024-05-18 15:40:00'),
(1, 63, 'Does anyone think Elara might betray the oath in book 3? I’m nervous.', '2024-05-22 17:10:00'),
(1, 71, 'I love how detailed her magic systems are. Anyone else taking notes?', '2024-06-02 09:55:00'),
(1, 75, 'New poem dropped today in her Void Verses notebook — so beautiful.', '2024-06-06 14:30:00'),
(1, 42, 'Yes! I saw it too. The galaxy line hit hard.', '2024-06-06 15:05:00'),
(1, 51, 'Anyone planning a re-read before the next book?', '2024-06-10 11:20:00'),
(1, 59, 'I’m on it next week. Need to refresh the lore.', '2024-06-12 18:45:00'),
(1, 67, 'Maya said in a post she’s outlining the final battle — so hyped!', '2024-06-20 13:35:00'),

(2, 55, 'Hello Eldoria fans! Let’s talk maps, characters, theories — all things Chronicles!', '2024-09-08 11:50:00'),
(2, 42, 'The side stories notebook is gold. Anyone else obsessed with the companion tales?', '2024-09-09 12:25:00'),
(2, 50, 'Elara’s backstory in the new companion piece broke me.', '2024-09-11 16:10:00'),
(2, 58, 'Who’s your favorite side character? I vote for the shadow weaver.', '2024-09-16 10:40:00'),

(3, 63, 'Welcome to Maya’s Void Poets — space poetry, cosmic emotions, deep thoughts only.', '2025-01-12 09:35:00'),
(3, 49, 'The “galaxies forget their names” line is living rent-free in my head.', '2025-01-13 15:20:00'),
(3, 57, 'Does anyone write poetry inspired by Maya’s style?', '2025-01-15 11:55:00'),

(4, 71, 'Dragon Oath fans assemble! Favorite moments? Theories? Let’s go!', '2025-03-25 17:00:00'),
(4, 48, 'The oath-keeping scene still gives me chills every re-read.', '2025-03-26 11:10:00'),
(4, 56, 'Book 3 battle hype is real. Maya is cooking.', '2025-03-29 14:35:00'),

(9, 44, 'Hi romance lovers! Luna Scott discussion group — all her books welcome!', '2024-03-22 17:35:00'),
(9, 51, 'Blossoms After Rain is my comfort read. What’s yours?', '2024-03-24 15:10:00'),
(9, 59, 'The reunion scene in Blossoms made me cry happy tears.', '2024-03-28 10:45:00'),
(9, 67, 'Hearts on the Horizon train station goodbye — still recovering.', '2024-04-02 18:20:00'),
(9, 75, 'Luna’s epistolary style is so unique. Anyone else love letters in romance?', '2024-04-08 13:55:00'),
(9, 44, 'New short story just posted in her notebook! Go read!', '2024-04-12 09:30:00'),

(10, 52, 'Blossoms After Rain book club starting here!', '2024-07-10 11:00:00'),
(10, 46, 'Chapter 5 discussion: did anyone else scream at the confession?', '2024-07-12 16:25:00'),
(10, 54, 'Luna really knows how to write longing.', '2024-07-15 11:50:00'),

(17, 47, 'Welcome to Sophia Lane Mystery Den! Spoiler tag everything.', '2024-06-05 12:45:00'),
(17, 55, 'The library body discovery scene — perfect cozy mystery vibe.', '2024-06-07 10:30:00'),
(17, 63, 'Who do you think did it in Midnight Alibi?', '2024-06-10 15:15:00'),
(17, 71, 'Sophia’s clues are so subtle. Re-reading now.', '2024-06-13 19:40:00'),

(22, 49, 'Zoe Morgan Mindful Circle — let’s share our reflections!', '2024-08-14 09:30:00'),
(22, 57, 'Did the unsent letter exercise. Very cathartic.', '2024-08-16 14:55:00'),
(22, 65, 'Quiet Rebellion section helped me set boundaries.', '2024-08-20 11:20:00'),

(26, 53, 'Liam Foster Cyberpunk Hub — let’s talk twists!', '2024-09-20 15:35:00'),
(26, 60, 'Echo Protocol future-self reveal — insane!', '2024-09-22 10:10:00'),
(26, 64, 'Neon Requiem is still my favorite Liam book.', '2024-09-25 17:45:00'),

(35, 56, 'Welcome to Iris Clark Graphic Novel Fans!', '2025-06-22 11:35:00'),
(35, 60, 'Her panel pacing is so good.', '2025-06-23 14:50:00'),

(45, 78, 'Celeste Brown Astrology Circle — moon signs & writing inspo!', '2025-10-05 16:00:00'),
(45, 82, 'Full moon energy hitting her latest post hard.', '2025-10-07 11:25:00');

-- POSTS BY READERS
-- ~80–100 records

INSERT IGNORE INTO posts (notebook_id, author_id, content, image, created_at) VALUES

(NULL, 42, 'Just finished Maya Stone''s Crown of Shadows... that ending left me speechless 😭 Who else cried?', NULL, '2025-04-10 21:15:00'),
(NULL, 42, 'Current read: Luna Scott - Hearts on the Horizon. The train station scene broke me. 10/10 recommend.', 'https://picsum.photos/seed/book-on-train/800/450', '2025-11-28 19:40:00'),
(NULL, 42, 'Anyone else obsessed with Sophia Lane mysteries? The library vibes are everything.', NULL, '2026-01-15 14:55:00'),
(NULL, 42, 'Weekend mood: tea + Zoe Morgan''s journal prompts. Feeling peaceful.', 'https://picsum.photos/seed/tea-journal/800/450', '2026-02-08 10:30:00'),

(NULL, 44, 'Luna Scott ruined romance for me — nothing else compares anymore 💔', NULL, '2025-02-20 22:10:00'),
(NULL, 44, 'Rereading Blossoms After Rain for the third time. Comfort book forever.', NULL, '2025-09-05 16:45:00'),
(NULL, 44, 'Maya Stone fans — did you catch the new companion story in Eldoria? So good!', NULL, '2026-01-22 11:20:00'),

(NULL, 47, 'Midnight reading session: Liam Foster''s Echo Protocol. The twist in ch7... wow.', NULL, '2026-02-14 01:35:00'),
(NULL, 47, 'Why is Sophia Lane so good at suspense? I finished Midnight Alibi in one sitting.', NULL, '2025-12-18 23:50:00'),
(NULL, 47, 'Book hangover after Henry Shaw''s Tides of Valor. Need something light next.', NULL, '2026-01-30 08:15:00'),

(NULL, 51, 'Urdu poetry lovers — Maya Stone''s Void Verses has some lines that feel very desi somehow.', NULL, '2026-01-10 20:40:00'),
(NULL, 51, 'Slow reader here. Currently savoring Zoe Morgan''s Compass of the Self. Worth every page.', NULL, '2025-11-02 12:05:00'),

(NULL, 55, 'Liam Foster plot twists should come with a health warning. My jaw is still on the floor.', NULL, '2026-02-13 18:25:00'),
(NULL, 55, 'Sophia Lane clue drop today — I called it! But still shocked.', NULL, '2026-01-15 21:10:00'),
(NULL, 55, 'Anyone else think Maya is about to break our hearts in book 3?', NULL, '2026-02-01 09:50:00'),

(NULL, 59, 'Finished Neon Requiem in 2 days. Liam Foster doesn’t let you breathe.', NULL, '2025-10-20 23:55:00'),
(NULL, 59, 'Luna Scott''s epistolary style is addictive. Read Letters to Tomorrow in one go.', NULL, '2025-12-25 02:30:00'),

(NULL, 63, 'Harper Bell''s bedtime stories are my guilty pleasure as an adult.', NULL, '2025-08-15 22:40:00'),
(NULL, 63, 'Zoe''s Quiet Rebellion chapter made me rethink a lot of things.', NULL, '2025-07-02 19:15:00'),

(NULL, 71, 'Henry Shaw''s Silent Fronts is heavy but so well written.', NULL, '2025-09-10 20:05:00'),
(NULL, 71, 'Maya Stone just posted a new poem — everyone go read it NOW.', NULL, '2026-01-09 17:30:00'),

(NULL, 75, 'Just joined the Maya Stone Fantasy Realm group. Loving the discussions!', NULL, '2025-06-01 13:20:00'),
(NULL, 75, 'Luna Scott romance fans — what’s your comfort reread?', NULL, '2025-12-01 21:45:00'),

(NULL, 80, 'Sophia Lane mysteries are my weekend escape. Cozy + thrilling = perfect.', NULL, '2025-11-09 19:10:00'),

(NULL, 85, 'Liam Foster sci-fi hits different at 2 AM.', NULL, '2026-02-13 02:15:00'),
(NULL, 85, 'Anyone else saving Zoe Morgan prompts for rainy days?', NULL, '2026-01-28 16:35:00'),

(NULL, 90, 'Book haul day: added two Maya Stone books. Broke but happy.', 'https://picsum.photos/seed/book-haul/800/450', '2025-10-18 15:50:00'),
(NULL, 95, 'Reading slump is real. Need recommendations — fantasy or romance?', NULL, '2026-02-04 11:25:00'),
(NULL, 100, 'Luna Scott''s latest short story in her notebook is so sweet.', NULL, '2025-12-20 20:40:00'),
(NULL, 105, 'Just left a comment on Maya''s latest post — too excited!', NULL, '2026-02-10 18:55:00');

-- FOLLOWS
-- ~250 records 

INSERT IGNORE INTO follows (follower_id, following_id, created_at) VALUES

(44, 42, '2025-04-15 10:20:00'),
(47, 42, '2025-05-02 13:45:00'),
(51, 42, '2025-06-18 17:10:00'),
(55, 42, '2025-08-03 09:35:00'),
(59, 42, '2025-10-12 14:50:00'),
(63, 42, '2025-11-28 19:15:00'),
(67, 42, '2026-01-05 11:40:00'),
(71, 42, '2026-01-20 16:05:00'),
(75, 42, '2026-02-02 08:30:00'),

(42, 44, '2025-03-10 12:55:00'),  
(48, 44, '2025-07-22 15:20:00'),
(52, 44, '2025-09-08 10:45:00'),
(56, 44, '2025-11-15 18:30:00'),
(60, 44, '2026-01-10 13:15:00'),
(64, 44, '2026-02-07 09:50:00'),

(47, 55, '2025-06-25 14:10:00'),
(51, 55, '2025-08-14 16:35:00'),
(59, 55, '2025-10-30 11:20:00'),
(63, 55, '2025-12-18 19:45:00'),
(67, 55, '2026-01-25 12:05:00'),

(42, 59, '2025-11-05 17:30:00'),
(44, 59, '2025-12-01 09:15:00'),
(48, 59, '2026-01-02 14:40:00'),
(52, 59, '2026-01-18 10:25:00'),
(56, 59, '2026-02-03 16:50:00'),
(60, 59, '2026-02-10 11:35:00'),
(64, 59, '2026-02-14 08:20:00'),
(68, 59, '2026-02-18 13:55:00'),

(71, 75, '2025-09-20 12:10:00'),
(75, 71, '2025-09-21 10:45:00'), 
(80, 85, '2025-10-15 18:25:00'),
(85, 80, '2025-10-16 14:50:00'),
(90, 95, '2026-01-05 16:30:00'),
(95, 90, '2026-01-06 11:15:00'),

(98, 100, '2025-07-30 09:40:00'),
(101, 105, '2025-08-12 13:05:00'),
(102, 108, '2025-11-25 17:20:00'),
(104, 107, '2026-01-12 10:55:00'),
(106, 109, '2026-02-01 15:40:00'),
(110, 42, '2026-02-10 08:15:00'),
(43, 59, '2025-12-20 19:30:00'),
(46, 63, '2026-01-08 12:45:00'),
(49, 71, '2025-10-25 16:10:00');

delimiter $$

create trigger before_transaction_insert
before insert on transactions
for each row
begin
    declare user_balance int;
    declare book_price int;

    select coin_balance into user_balance
    from wallets
    where user_id = new.user_id;

    select coin_price into book_price
    from books
    where id = new.book_id;

    if user_balance < book_price then
        signal sqlstate '45000'
        set message_text = 'insufficient coin balance';
    end if;

    set new.coins_spent = book_price;
end$$

delimiter ;

delimiter $$

create trigger after_transaction_insert
after insert on transactions
for each row
begin
    update wallets
    set coin_balance = coin_balance - new.coins_spent
    where user_id = new.user_id;
end$$

delimiter ;

delimiter $$

create trigger after_user_insert
after insert on users
for each row
begin
    insert into wallets (user_id, coin_balance)
    values (new.id, 0);
end$$

delimiter ;