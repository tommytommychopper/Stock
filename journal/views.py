from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Journal
from .forms import JournalForm

@login_required(login_url='/login/')
def journal(request):
    user = request.user
    journals = Journal.objects.filter(user=user)
    journals = {'journals' : journals}
    return render(request, 'journal/journal.html', journals )

def view_journal(request, id):
    journal = Journal.objects.get(id=id)
    journal = {'journal' : journal}
    return render(request, 'journal/journal_view.html', journal)

def add_journal(request):
    page_data = {'journal_form' : JournalForm}
    if request.method == 'POST':
        journal_form = JournalForm(request.POST)
        if journal_form.is_valid():
            d = journal_form.cleaned_data['description']
            c = journal_form.cleaned_data['content']
            user = request.user
            Journal(user=user, description=d, content=c).save()
            return redirect('journal')
        else:
            page_data['journal_form'] = journal_form
    return render(request, 'journal/journal_add.html', page_data)

def edit_journal(request, id):
    journal = Journal.objects.get(id=id)
    page_data = {'journal_form' : JournalForm(instance=journal) }
    if request.method == 'POST':
        journal_form = JournalForm(request.POST)
        if journal_form.is_valid():
            d = journal_form.cleaned_data['description']
            c = journal_form.cleaned_data['content']
            journal.description = d
            journal.content= c
            journal.save()
            return redirect('journal')
        else:
            page_data['journal_form'] = journal_form
    return render(request, 'journal/journal_edit.html', page_data)

def delete_journal(request, id):
        journal = Journal.objects.get(id=id)
        journal.delete()
        return redirect('journal')