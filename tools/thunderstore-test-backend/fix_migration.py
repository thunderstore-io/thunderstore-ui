import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "thunderstore.core.settings")

from django import setup

setup()

import thunderstore.monkeypatch  # noqa


from thunderstore.community.models import Community, CommunitySite
from django.contrib.sites.models import Site


def setup_default_community():
    primary_host = os.environ.get("PRIMARY_HOST", "127.0.0.1:8000")
    default_community = Community.objects.filter(identifier="riskofrain2").first()
    if not default_community:
        default_community = Community.objects.create(
            identifier="riskofrain2", name="Risk of Rain 2"
        )
    community_site = default_community.sites.first()

    if not community_site:
        site = Site.objects.filter(community=None).first()
        if not site:
            site = Site.objects.create(
                domain=primary_host, name=default_community.name
            )
        site.domain = primary_host
        site.save()
        CommunitySite.objects.create(
            site=site,
            community=default_community,
        )
    else:
        site = community_site.site
        site.domain = primary_host
        site.save()

    print("Created default community")
    print(f"{site=}")
    print(f"{primary_host=}")


setup_default_community()
