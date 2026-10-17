-- ================================================
-- AURALLY REALTY — Supabase Database Schema
-- Paste this into: Supabase → SQL Editor → New Query
-- Then click the green "Run" button
-- ================================================


-- ============================
-- TABLE 1: PROFILES
-- Extends Supabase's built-in auth.users table
-- ============================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID    REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username    TEXT    UNIQUE NOT NULL,
  phone       TEXT    UNIQUE NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  is_admin    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles (for showing "listed by" info)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

-- Users can only edit their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create a profile row when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, ''),
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      'user_' || SUBSTR(NEW.id::TEXT, 1, 8)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================
-- TABLE 2: PROPERTIES
-- Main listings table
-- ============================
CREATE TABLE IF NOT EXISTS public.properties (
  id              BIGSERIAL PRIMARY KEY,
  owner_id        UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Listing type
  listing_type    TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent')),
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending', 'active', 'rejected', 'sold', 'rented')),

  -- Basic info
  title           TEXT NOT NULL,
  description     TEXT,
  property_type   TEXT NOT NULL
                  CHECK (property_type IN ('apartment','villa','plot','commercial','pg','independent_house')),

  -- Location
  area            TEXT NOT NULL,
  address         TEXT NOT NULL,
  city            TEXT DEFAULT 'Chennai',
  pincode         TEXT,

  -- Property specs
  beds            INTEGER DEFAULT 0,
  baths           INTEGER DEFAULT 0,
  sqft            INTEGER,
  floor_number    TEXT,
  total_floors    INTEGER,
  facing          TEXT CHECK (facing IN ('East','West','North','South','North-East','North-West','South-East','South-West')),
  furnishing      TEXT CHECK (furnishing IN ('Fully Furnished','Semi Furnished','Unfurnished')),
  property_age    TEXT,

  -- Price
  price           DECIMAL(12,2) NOT NULL,
  price_unit      TEXT DEFAULT 'Lakhs' CHECK (price_unit IN ('Lakhs','Cr','/mo')),
  price_negotiable BOOLEAN DEFAULT FALSE,

  -- Images (array of URLs)
  images          TEXT[] DEFAULT '{}',

  -- Flags
  is_featured     BOOLEAN DEFAULT FALSE,
  is_verified     BOOLEAN DEFAULT FALSE,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Public can view active listings
CREATE POLICY "Active properties are public"
  ON public.properties FOR SELECT
  USING (status = 'active' OR auth.uid() = owner_id);

-- Logged-in users can post
CREATE POLICY "Logged-in users can post properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Owners can edit their own listings
CREATE POLICY "Owners can update own listings"
  ON public.properties FOR UPDATE
  USING (auth.uid() = owner_id);

-- Owners can delete their own listings
CREATE POLICY "Owners can delete own listings"
  ON public.properties FOR DELETE
  USING (auth.uid() = owner_id);

-- Admins can manage all listings
CREATE POLICY "Admins have full access to properties"
  ON public.properties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );


-- ============================
-- TABLE 3: INQUIRIES
-- Buyer contacts seller about a property
-- ============================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id            BIGSERIAL PRIMARY KEY,
  property_id   BIGINT REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  from_user_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT,
  message       TEXT DEFAULT 'I am interested in this property.',
  status        TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),

  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Property owners can see inquiries for their listings
CREATE POLICY "Owners can view inquiries on their properties"
  ON public.inquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND owner_id = auth.uid()
    )
  );

-- Anyone (even not logged in) can submit an inquiry
CREATE POLICY "Anyone can submit an inquiry"
  ON public.inquiries FOR INSERT WITH CHECK (true);

-- Admins see all
CREATE POLICY "Admins see all inquiries"
  ON public.inquiries FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );


-- ============================
-- TABLE 4: SAVED PROPERTIES
-- Users bookmark/favourite properties
-- ============================
CREATE TABLE IF NOT EXISTS public.saved_properties (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  property_id BIGINT REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  saved_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)   -- prevent duplicate saves
);

ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- Users manage only their own saved list
CREATE POLICY "Users manage own saved properties"
  ON public.saved_properties FOR ALL
  USING (auth.uid() = user_id);


-- ============================
-- AUTO-UPDATE TIMESTAMPS
-- ============================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_timestamp
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================
-- SAMPLE DATA (for testing)
-- Uncomment ONLY after you create a real account
-- and paste your user ID from: Auth → Users tab
-- ============================
/*
INSERT INTO public.properties
  (owner_id, listing_type, status, title, description, property_type, area, address, beds, baths, sqft, price, price_unit, is_verified, is_featured)
VALUES
  ('PASTE-YOUR-USER-UUID-HERE', 'sale', 'active',
   'Luxury 3BHK Apartment in Anna Nagar',
   'Beautifully designed apartment with modern interiors, 24hr security, and parking.',
   'apartment', 'Anna Nagar', 'No. 12, 6th Avenue, Anna Nagar, Chennai - 600040',
   3, 2, 1450, 85, 'Lakhs', true, true),

  ('PASTE-YOUR-USER-UUID-HERE', 'rent', 'active',
   'Spacious 2BHK Flat in T. Nagar',
   'Well-maintained flat near Pondy Bazaar bus stop. Semi-furnished.',
   'apartment', 'T. Nagar', 'No. 34, Usman Road, T. Nagar, Chennai - 600017',
   2, 2, 1100, 22000, '/mo', true, true);
*/


-- ============================
-- VERIFY — Run this to confirm all 4 tables exist
-- ============================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
-- Expected output: inquiries, profiles, properties, saved_properties
